from rest_framework.permissions import BasePermission, SAFE_METHODS


class EsAdminParaEliminarOEditarVentas(BasePermission):
    """Vendedor: consulta y registra. Administrador (is_staff): además edita ventas y elimina registros."""
    message = 'Solo el administrador puede realizar esta acción.'

    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in SAFE_METHODS or request.method == 'POST':
            return True
        if request.method == 'DELETE':
            return request.user.is_staff
        # PUT/PATCH: productos y clientes los puede actualizar el vendedor; las ventas solo el admin.
        if getattr(view, 'basename', '') == 'venta':
            return request.user.is_staff
        return True
