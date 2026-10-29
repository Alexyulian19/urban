from django.db import transaction
from django.db.models import ProtectedError
from rest_framework import filters, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Cliente, Producto, Venta
from .serializers import ClienteSerializer, ProductoSerializer, VentaSerializer


def datos_usuario(user):
    return {'usuario': user.username, 'nombre': user.get_full_name() or user.username,
            'rol': 'administrador' if user.is_staff else 'vendedor'}


class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if not serializer.is_valid():
            return Response({'detail': 'Usuario o contraseña incorrectos.'}, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, **datos_usuario(user)})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def yo(request):
    return Response(datos_usuario(request.user))


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


class BorradoProtegidoMixin:
    mensaje_protegido = 'No se puede eliminar porque tiene ventas registradas.'

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response({'detail': self.mensaje_protegido}, status=status.HTTP_409_CONFLICT)


class ClienteViewSet(BorradoProtegidoMixin, viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'email', 'telefono']
    ordering_fields = ['id', 'nombre']
    mensaje_protegido = 'No se puede eliminar el cliente porque tiene ventas registradas.'


class ProductoViewSet(BorradoProtegidoMixin, viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'descripcion']
    ordering_fields = ['id', 'nombre', 'precio', 'stock']
    mensaje_protegido = 'No se puede eliminar el producto porque tiene ventas registradas.'


class VentaViewSet(viewsets.ModelViewSet):
    serializer_class = VentaSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['cliente__nombre', 'producto__nombre']
    ordering_fields = ['fecha', 'total']

    def get_queryset(self):
        qs = Venta.objects.select_related('cliente', 'producto', 'vendedor')
        cliente = self.request.query_params.get('cliente')
        if cliente:
            qs = qs.filter(cliente_id=cliente)
        desde = self.request.query_params.get('desde')
        hasta = self.request.query_params.get('hasta')
        if desde:
            qs = qs.filter(fecha__date__gte=desde)
        if hasta:
            qs = qs.filter(fecha__date__lte=hasta)
        return qs

    @transaction.atomic
    def perform_destroy(self, venta):
        # Anular una venta devuelve las unidades al inventario.
        producto = Producto.objects.select_for_update().get(pk=venta.producto_id)
        producto.stock += venta.cantidad
        producto.save(update_fields=['stock'])
        venta.delete()
