# Documentación del Proyecto Almacén de Ropa

Aplicación fullstack para la gestión de un almacén de ropa con clientes, productos y ventas. Incluye backend Django con API REST y frontend Angular.

## Descripción

Este proyecto contiene una aplicación de almacén construida con :
- **Backend**: Django 6.0.3 con Django REST Framework para API REST.
- **Frontend**: Angular con comunicación HTTP al backend.

Incluye una app interna `almacen` con modelos de dominio para gestionar clientes, productos y ventas.

## Estructura del proyecto

```
proyectoalmacenropa/        # Backend Django
├── manage.py               # Utilidad de Django
├── almacen/                # App de negocio
│   ├── models.py           # Modelos de datos
│   ├── serializers.py      # Serializers DRF
│   ├── views.py            # ViewSets DRF
│   └── ...
├── ropa_almacen/           # Configuración principal del proyecto
│   ├── settings.py         # Configuración Django
│   └── urls.py             # URLs principales con router DRF
└── frontend-ropa/          # Frontend Angular
    ├── package.json        # Scripts y dependencias de Angular
    ├── README.md           # Documentación del frontend Angular
    └── src/
        └── app/
            ├── app.ts          # Componente raíz standalone
            ├── app.config.ts   # Configuración de router y HTTP
            ├── services/
            │   └── api.ts     # Servicio para API REST
            ├── dashboard/     # Componente dashboard
            ├── productos/     # Componente productos
            ├── clientes/      # Componente clientes
            ├── ventas/        # Componente ventas
            └── app.routes.ts  # Rutas Angular

env/                        # Entorno virtual Python
docs/                       # Documentación y dependencias del proyecto
    ├── requirements.txt    # Dependencias Python
```

## Requisitos

- Python 3.11+ (recomendado)
- Django 6.0.3
- Django REST Framework
- PostgreSQL
- Node.js 18+ (para frontend)
- Angular CLI

## Tecnologías principales

**Backend:**
- Django 6.0.3
- Django REST Framework - para API REST
- psycopg2-binary - driver para PostgreSQL
- django-cors-headers - manejo de CORS

**Frontend:**
- Angular 21.2.0
- Angular CLI 21.2.2
- RxJS 7.8.0
- TypeScript 5.9.2
- NPM 10.9.4

## Configuración del entorno

### Backend (Django)

1. Activar el entorno virtual en PowerShell:
   ```powershell
   cd c:\Users\Alex Caviedes\Desktop\proyectoAlmacenRopa
   .\env\Scripts\Activate.ps1
   ```

2. Instalar dependencias:
   ```powershell
   pip install -r docs/requirements.txt
   ```

3. Ejecutar migraciones:
   ```powershell
   cd proyectoalmacenropa
   python manage.py migrate
   ```

4. Crear un superusuario (opcional):
   ```powershell
   python manage.py createsuperuser
   ```

5. Iniciar el servidor de desarrollo:
   ```powershell
   python manage.py runserver
   ```
   El servidor estará disponible en `http://127.0.0.1:8000/`

### Frontend (Angular)

1. Instalar dependencias:
   ```powershell
   cd proyectoalmacenropa\frontend-ropa
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```powershell
   ng serve
   ```
   La aplicación estará disponible en `http://localhost:4200/`

#### Componentes implementados

- **Dashboard** (`/`) - Página principal
- **Productos** (`/productos`) - Gestión de productos
- **Clientes** (`/clientes`) - Gestión de clientes  
- **Ventas** (`/ventas`) - Gestión de ventas

#### Servicio API

Se ha implementado `ApiService` que maneja la comunicación HTTP con el backend:

- `getProductos()`, `crearProducto()` - Operaciones con productos
- `getClientes()`, `crearCliente()` - Operaciones con clientes
- `getVentas()`, `crearVenta()` - Operaciones con ventas

La URL base del API está configurada en `http://127.0.0.1:8000/api`.

Este frontend utiliza `provideHttpClient()` en `src/app/app.config.ts`, por lo que el servicio HTTP está integrado en la configuración de la aplicación.

## Configuración de la base de datos

La configuración actual usa PostgreSQL con los siguientes valores (en `ropa_almacen/settings.py`):

- **ENGINE**: `django.db.backends.postgresql`
- **NAME**: `bd_AlmacenRopa`
- **USER**: `postgres`
- **PASSWORD**: `1234`
- **HOST**: `127.0.0.1`
- **PORT**: `5432`

> Cambia estos valores para tu entorno local o de producción.

## Configuración de la aplicación

- **IDIOMA**: Español (Colombia) - `es-co`
- **ZONA HORARIA**: America/Bogota
- **CORS**: Habilitado para todos los orígenes (`CORS_ALLOW_ALL_ORIGINS = True`)
- **DEBUG**: `True` (cambiar a `False` en producción)

### Apps instaladas

- Django (admin, auth, contenttypes, sessions, messages, staticfiles)
- `rest_framework` - API REST
- `corsheaders` - soporte CORS
- `almacen` - app de negocio

## Modelos principales

### Cliente

Campos:

- `nombre` - `CharField(max_length=100)`
- `email` - `EmailField()`
- `telefono` - `CharField(max_length=20)`
- `direccion` - `TextField()`

Representa a los clientes que realizan compras.

### Producto

Campos:

- `nombre` - `CharField(max_length=100)`
- `descripcion` - `TextField(blank=True)`
- `precio` - `DecimalField(max_digits=10, decimal_places=2)`
- `stock` - `IntegerField()`

Representa los artículos de ropa disponibles en inventario.

### Venta

Campos:

- `cliente` - `ForeignKey(Cliente, on_delete=models.CASCADE)`
- `producto` - `ForeignKey(Producto, on_delete=models.CASCADE)`
- `cantidad` - `IntegerField()`
- `fecha` - `DateTimeField(auto_now_add=True)`
- `total` - `DecimalField(max_digits=10, decimal_places=2)`

Registra una operación de venta. El campo `total` está pensado para almacenar el importe total de la transacción.

## Estado actual

- ✅ Backend Django configurado con `ropa_almacen` como módulo de configuración.
- ✅ App `almacen` registrada en `INSTALLED_APPS`.
- ✅ Django REST Framework integrado con viewsets y routers.
- ✅ Serializers implementados para `Cliente`, `Producto` y `Venta`.
- ✅ API REST completa con endpoints CRUD para todas las entidades.
- ✅ CORS habilitado para desarrollo.
- ✅ Frontend Angular (`frontend-ropa`) creado con componentes.
- ✅ Servicio API implementado para comunicación HTTP.
- ✅ Rutas configuradas en backend (`/api/`) y frontend.
- ✅ El frontend utiliza `provideHttpClient()` y router standalone.
- ⏳ Componentes frontend necesitan implementación completa de UI.
- ⏳ No hay autenticación implementada.

## Cómo ejecutar el proyecto

### Opción 1: Ejecutar solo el backend

1. Activar el entorno virtual.
2. Ejecutar migraciones:
   ```powershell
   cd proyectoalmacenropa
   python manage.py migrate
   ```
3. Iniciar el servidor:
   ```powershell
   python manage.py runserver
   ```

### Opción 2: Ejecutar backend + frontend

**Terminal 1 (Backend):**
```powershell
cd proyectoalmacenropa
python manage.py runserver
```

**Terminal 2 (Frontend):**
```powershell
cd proyectoalmacenropa\frontend-ropa
ng serve
```

Una vez ejecutándose ambos servidores:
- Backend API: `http://127.0.0.1:8000/api/`
- Frontend: `http://localhost:4200/`
- Admin Django: `http://127.0.0.1:8000/admin/`

## API REST

El backend expone un API REST completa a través de Django REST Framework. Los endpoints disponibles están en:

- **Admin**: `http://127.0.0.1:8000/admin/`
- **API base**: `http://127.0.0.1:8000/api/`

### Endpoints disponibles

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/clientes/` | GET | Listar todos los clientes |
| `/api/clientes/` | POST | Crear nuevo cliente |
| `/api/clientes/{id}/` | GET | Obtener cliente específico |
| `/api/clientes/{id}/` | PUT | Actualizar cliente |
| `/api/clientes/{id}/` | DELETE | Eliminar cliente |
| `/api/productos/` | GET | Listar todos los productos |
| `/api/productos/` | POST | Crear nuevo producto |
| `/api/productos/{id}/` | GET | Obtener producto específico |
| `/api/productos/{id}/` | PUT | Actualizar producto |
| `/api/productos/{id}/` | DELETE | Eliminar producto |
| `/api/ventas/` | GET | Listar todas las ventas |
| `/api/ventas/` | POST | Crear nueva venta |
| `/api/ventas/{id}/` | GET | Obtener venta específica |
| `/api/ventas/{id}/` | PUT | Actualizar venta |
| `/api/ventas/{id}/` | DELETE | Eliminar venta |

### Serializers

Se han implementado serializers ModelSerializer para todos los modelos:

- `ClienteSerializer` - serializa todos los campos del modelo Cliente
- `ProductoSerializer` - serializa todos los campos del modelo Producto  
- `VentaSerializer` - serializa todos los campos del modelo Venta

### ViewSets

Se utilizan ModelViewSet que proporcionan automáticamente las operaciones CRUD:

- `ClienteViewSet` - operaciones CRUD para clientes
- `ProductoViewSet` - operaciones CRUD para productos
- `VentaViewSet` - operaciones CRUD para ventas

### CORS

La aplicación permite solicitudes desde cualquier origen. Esto se puede restringir modificando `CORS_ALLOWED_ORIGINS` en `settings.py` para producción.

## Próximos pasos recomendados

### Backend
- ✅ API REST completa implementada
- Agregar validaciones personalizadas en serializers
- Implementar permisos y autenticación (JWT o token-based)
- Agregar filtros y búsqueda en los endpoints
- Implementar lógica de negocio (ej: actualizar stock al vender)

### Frontend
- ✅ Componentes básicos creados con navegación
- Completar las plantillas HTML de los componentes
- Implementar formularios completos para crear/editar
- Agregar estilos CSS para mejor apariencia
- Implementar manejo de errores y mensajes de usuario
- Agregar confirmaciones para operaciones de eliminación

### Funcionalidades adicionales
- Implementar autenticación de usuarios
- Agregar dashboard con estadísticas
- Implementar búsqueda y filtros en las listas
- Agregar paginación en las listas largas
- Implementar exportación de datos (PDF, Excel)

### Seguridad y despliegue
- Ajustar `DEBUG = False` en producción
- Configurar `ALLOWED_HOSTS` y `CORS_ALLOWED_ORIGINS`
- Usar variables de entorno para credenciales
- Evaluar despliegue (Azure, Heroku, Railway, etc.)


## Correcciones aplicadas (octubre 2026)

Después de las pruebas del sistema se hicieron estas correcciones:

- **Ventas y stock:** al registrar una venta el servidor descuenta las unidades del producto, rechaza la venta si no hay existencias suficientes o la cantidad no es válida, y calcula el total (el navegador ya no lo envía). Editar una venta reajusta el stock y anularla devuelve las unidades al inventario.
- **Historial protegido:** no se puede eliminar un cliente o un producto que tenga ventas (`on_delete=PROTECT`); el sistema responde con un mensaje claro.
- **Seguridad:** la API exige iniciar sesión (token). Hay dos roles: *vendedor* (consulta y registra) y *administrador* (además edita/anula ventas y elimina registros). CORS limitado al frontend. `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS` y la conexión a PostgreSQL se pueden definir por variables de entorno.
- **Validaciones:** precio y stock no negativos, teléfono solo con números, correo único, productos duplicados, caracteres `<` y `>` rechazados. En Angular los campos inválidos se marcan en rojo con su mensaje.
- **Consultas:** búsqueda en productos, clientes y ventas (`?search=`), historial por cliente (`/api/ventas/?cliente=ID`), filtro por fechas (`?desde=AAAA-MM-DD&hasta=AAAA-MM-DD`) y paginación opcional (`?page=1`). El historial muestra fecha, vendedor y precios en pesos.
- **Pruebas automáticas del backend:** `python manage.py test almacen` (16 pruebas).

### Puesta en marcha después de actualizar

```bash
cd proyectoalmacenropa
python manage.py migrate
python manage.py crear_usuarios          # admin / Admin2026*   y   vendedor / Vendedor2026*
python manage.py runserver
```

Cambie las contraseñas iniciales con `python manage.py crear_usuarios --admin-pass NUEVA --vendedor-pass NUEVA` o desde `/admin/`.

### Pendientes

- Talla, categoría (busos, jeans, bermudas, camisas, gorras, tenis, ropa interior) y género del producto.
- Cédula del cliente y programa de fidelización.
- Diseño responsive para celular.
- Actualizar los archivos `.spec.ts` de Angular, que no compilan.
