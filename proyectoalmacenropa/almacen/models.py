from django.core.validators import MinValueValidator, RegexValidator
from django.db import models


class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    telefono = models.CharField(
        max_length=20,
        validators=[RegexValidator(r'^\+?\d{7,15}$', 'El teléfono solo puede tener números (7 a 15 dígitos).')],
    )
    direccion = models.TextField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2,
                                 validators=[MinValueValidator(0, 'El precio no puede ser negativo.')])
    stock = models.PositiveIntegerField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.nombre


class Venta(models.Model):
    # PROTECT: no se puede borrar un cliente o un producto que tenga ventas,
    # así el historial financiero nunca se pierde.
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, related_name='ventas')
    producto = models.ForeignKey(Producto, on_delete=models.PROTECT, related_name='ventas')
    cantidad = models.PositiveIntegerField(validators=[MinValueValidator(1, 'La cantidad debe ser mayor que cero.')])
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=12, decimal_places=2)
    vendedor = models.ForeignKey('auth.User', on_delete=models.PROTECT, null=True, blank=True, related_name='ventas')

    class Meta:
        ordering = ['-fecha']

    def __str__(self):
        return f"Venta {self.id} - {self.cliente}"
