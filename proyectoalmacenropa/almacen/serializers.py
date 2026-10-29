import re

from django.db import transaction
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import Cliente, Producto, Venta

PATRON_HTML = re.compile(r'[<>]')


def sin_html(valor, campo='Este campo'):
    if valor and PATRON_HTML.search(valor):
        raise serializers.ValidationError(f'{campo} no puede contener los caracteres < o >.')
    return valor.strip() if isinstance(valor, str) else valor


class ClienteSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=254, validators=[
        UniqueValidator(queryset=Cliente.objects.all(), lookup='iexact', message='Ya existe un cliente con ese correo.')])

    class Meta:
        model = Cliente
        fields = '__all__'

    def validate_nombre(self, v):
        return sin_html(v, 'El nombre')

    def validate_direccion(self, v):
        return sin_html(v, 'La dirección')


class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

    def validate_nombre(self, v):
        return sin_html(v, 'El nombre')

    def validate_descripcion(self, v):
        return sin_html(v, 'La descripción')

    def validate(self, data):
        nombre = data.get('nombre', getattr(self.instance, 'nombre', ''))
        descripcion = data.get('descripcion', getattr(self.instance, 'descripcion', ''))
        repetido = Producto.objects.filter(nombre__iexact=nombre, descripcion__iexact=descripcion)
        if self.instance:
            repetido = repetido.exclude(pk=self.instance.pk)
        if repetido.exists():
            raise serializers.ValidationError('Ya existe un producto con ese nombre y esa descripción o marca.')
        return data


class VentaSerializer(serializers.ModelSerializer):
    cliente_nombre = serializers.CharField(source='cliente.nombre', read_only=True)
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    vendedor_nombre = serializers.CharField(source='vendedor.username', read_only=True, default=None)

    class Meta:
        model = Venta
        fields = ['id', 'cliente', 'cliente_nombre', 'producto', 'producto_nombre', 'cantidad',
                  'fecha', 'total', 'vendedor', 'vendedor_nombre']
        # El total y el vendedor los define el servidor, nunca el navegador.
        read_only_fields = ['fecha', 'total', 'vendedor']

    def validate(self, data):
        producto = data.get('producto', getattr(self.instance, 'producto', None))
        cantidad = data.get('cantidad', getattr(self.instance, 'cantidad', 0))
        disponible = producto.stock
        # Si se está editando una venta del mismo producto, sus unidades vuelven a estar disponibles.
        if self.instance and self.instance.producto_id == producto.id:
            disponible += self.instance.cantidad
        if cantidad > disponible:
            raise serializers.ValidationError(
                {'cantidad': f'Stock insuficiente: de "{producto.nombre}" solo hay {disponible} unidades.'})
        return data

    @transaction.atomic
    def create(self, data):
        producto = Producto.objects.select_for_update().get(pk=data['producto'].pk)
        if data['cantidad'] > producto.stock:
            raise serializers.ValidationError({'cantidad': 'Stock insuficiente.'})
        producto.stock -= data['cantidad']
        producto.save(update_fields=['stock'])
        data['total'] = producto.precio * data['cantidad']
        data['vendedor'] = self.context['request'].user
        return super().create(data)

    @transaction.atomic
    def update(self, venta, data):
        anterior = Producto.objects.select_for_update().get(pk=venta.producto_id)
        anterior.stock += venta.cantidad           # se devuelve lo vendido antes
        anterior.save(update_fields=['stock'])
        nuevo = Producto.objects.select_for_update().get(pk=data.get('producto', venta.producto).pk)
        cantidad = data.get('cantidad', venta.cantidad)
        if cantidad > nuevo.stock:
            raise serializers.ValidationError({'cantidad': 'Stock insuficiente.'})
        nuevo.stock -= cantidad
        nuevo.save(update_fields=['stock'])
        data['total'] = nuevo.precio * cantidad
        return super().update(venta, data)
