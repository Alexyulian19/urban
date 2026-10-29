from django.contrib.auth.models import User
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Crea los usuarios iniciales: un administrador y un vendedor.'

    def add_arguments(self, parser):
        parser.add_argument('--admin-pass', default='Admin2026*')
        parser.add_argument('--vendedor-pass', default='Vendedor2026*')

    def handle(self, *args, **o):
        for usuario, clave, staff in [('admin', o['admin_pass'], True), ('vendedor', o['vendedor_pass'], False)]:
            u, creado = User.objects.get_or_create(username=usuario)
            u.is_staff = staff
            u.is_superuser = staff
            u.set_password(clave)
            u.save()
            self.stdout.write(f"{'Creado' if creado else 'Actualizado'}: {usuario} ({'administrador' if staff else 'vendedor'})")
        self.stdout.write('Cambie estas contraseñas antes de usar el sistema en el almacén.')
