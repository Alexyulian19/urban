from decimal import Decimal

from django.contrib.auth.models import User
from rest_framework.test import APITestCase

from .models import Cliente, Producto, Venta


class BaseAlmacen(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user('admin_t', password='x', is_staff=True)
        self.vendedor = User.objects.create_user('vend_t', password='x')
        self.client.force_authenticate(self.vendedor)
        self.jean = Producto.objects.create(nombre='Jean slim', descripcion='Levis', precio=Decimal('125000'), stock=10)
        self.cli = Cliente.objects.create(nombre='Carlos', email='c@mail.com', telefono='3101234567', direccion='Neiva')

    def vender(self, cantidad, producto=None):
        return self.client.post('/api/ventas/', {'cliente': self.cli.id, 'producto': (producto or self.jean).id,
                                                 'cantidad': cantidad, 'total': 1}, format='json')


class PruebasVentas(BaseAlmacen):
    def test_venta_descuenta_stock(self):
        r = self.vender(3)
        self.assertEqual(r.status_code, 201)
        self.jean.refresh_from_db()
        self.assertEqual(self.jean.stock, 7)

    def test_total_lo_calcula_el_servidor(self):
        r = self.vender(2)
        self.assertEqual(Decimal(r.data['total']), Decimal('250000'))

    def test_no_vende_sin_stock(self):
        r = self.vender(50)
        self.assertEqual(r.status_code, 400)
        self.jean.refresh_from_db()
        self.assertEqual(self.jean.stock, 10)

    def test_no_acepta_cantidad_negativa_ni_cero(self):
        self.assertEqual(self.vender(-3).status_code, 400)
        self.assertEqual(self.vender(0).status_code, 400)

    def test_anular_venta_devuelve_stock(self):
        venta_id = self.vender(4).data['id']
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.delete(f'/api/ventas/{venta_id}/').status_code, 204)
        self.jean.refresh_from_db()
        self.assertEqual(self.jean.stock, 10)

    def test_vendedor_no_edita_ni_borra_ventas(self):
        venta_id = self.vender(1).data['id']
        self.assertEqual(self.client.delete(f'/api/ventas/{venta_id}/').status_code, 403)
        self.assertEqual(self.client.put(f'/api/ventas/{venta_id}/', {'cliente': self.cli.id, 'producto': self.jean.id,
                                                                     'cantidad': 1}, format='json').status_code, 403)

    def test_editar_venta_reajusta_stock(self):
        venta_id = self.vender(2).data['id']
        self.client.force_authenticate(self.admin)
        r = self.client.put(f'/api/ventas/{venta_id}/', {'cliente': self.cli.id, 'producto': self.jean.id,
                                                        'cantidad': 5}, format='json')
        self.assertEqual(r.status_code, 200)
        self.jean.refresh_from_db()
        self.assertEqual(self.jean.stock, 5)

    def test_historial_por_cliente(self):
        otro = Cliente.objects.create(nombre='Ana', email='a@mail.com', telefono='3150000000', direccion='x')
        self.vender(1)
        Venta.objects.create(cliente=otro, producto=self.jean, cantidad=1, total=1)
        r = self.client.get(f'/api/ventas/?cliente={self.cli.id}')
        self.assertEqual(len(r.data), 1)


class PruebasIntegridadYSeguridad(BaseAlmacen):
    def test_no_borra_cliente_con_ventas(self):
        self.vender(1)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.delete(f'/api/clientes/{self.cli.id}/').status_code, 409)
        self.assertEqual(Venta.objects.count(), 1)

    def test_sin_autenticacion_no_hay_acceso(self):
        self.client.force_authenticate(None)
        self.assertEqual(self.client.get('/api/clientes/').status_code, 401)

    def test_login_entrega_token_y_rol(self):
        self.client.force_authenticate(None)
        r = self.client.post('/api/login/', {'username': 'admin_t', 'password': 'x'}, format='json')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.data['rol'], 'administrador')


class PruebasValidaciones(BaseAlmacen):
    def test_precio_y_stock_negativos(self):
        self.assertEqual(self.client.post('/api/productos/', {'nombre': 'A', 'precio': -1, 'stock': 1}, format='json').status_code, 400)
        self.assertEqual(self.client.post('/api/productos/', {'nombre': 'B', 'precio': 1, 'stock': -1}, format='json').status_code, 400)

    def test_producto_duplicado(self):
        r = self.client.post('/api/productos/', {'nombre': 'jean slim', 'descripcion': 'levis', 'precio': 1, 'stock': 1}, format='json')
        self.assertEqual(r.status_code, 400)

    def test_telefono_y_correo_duplicado(self):
        base = {'nombre': 'X', 'email': 'nuevo@mail.com', 'telefono': 'abc', 'direccion': 'x'}
        self.assertEqual(self.client.post('/api/clientes/', base, format='json').status_code, 400)
        base.update(telefono='3100000000', email='c@mail.com')
        self.assertEqual(self.client.post('/api/clientes/', base, format='json').status_code, 400)

    def test_rechaza_html(self):
        r = self.client.post('/api/clientes/', {'nombre': '<script>', 'email': 'h@mail.com', 'telefono': '3100000000',
                                                'direccion': 'x'}, format='json')
        self.assertEqual(r.status_code, 400)

    def test_busqueda_y_paginacion(self):
        Producto.objects.create(nombre='Gorra plana', descripcion='New Era', precio=1, stock=1)
        self.assertEqual(len(self.client.get('/api/productos/?search=Gorra').data), 1)
        self.assertIn('count', self.client.get('/api/productos/?page=1').data)
