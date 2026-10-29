# Documentación del Proyecto Almacén de Ropa

Aplicación fullstack para la gestión de un almacén de ropa con clientes, productos y ventas. Incluye backend Django con API REST y frontend Angular.

Repositorio: https://github.com/Alexyulian19/urban

## Descripción

Este proyecto contiene una aplicación de almacén construida con:
- **Backend**: Django 6.0.3 con Django REST Framework para API REST.
- **Frontend**: Angular con comunicación HTTP al backend.
- **Base de datos**: PostgreSQL.

Incluye una app interna `almacen` con modelos de dominio para gestionar clientes, productos y ventas.

## Estructura del proyecto

```
urban/                          # Carpeta raíz del repositorio
├── README.md                   # Guía rápida de instalación
├── .gitignore
├── docs/                       # Documentación y dependencias
│   ├── documentacion.md        # Este documento
│   └── requirements.txt        # Dependencias Python
├── env/                        # Entorno virtual Python (se crea localmente, no se sube)
└── proyectoalmacenropa/        # Backend Django
    ├── manage.py               # Utilidad de Django
    ├── datos_productos.json        # Catálogo de productos (datos de prueba)
    ├── datos_clientes_ventas.json  # Clientes y ventas (datos de prueba)
    ├── almacen/                # App de negocio
    │   ├── models.py           # Modelos de datos
    │   ├── serializers.py      # Serializers DRF
    │   ├── views.py            # ViewSets DRF
    │   ├── tests.py            # Pruebas automáticas
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
                ├── app.routes.ts   # Rutas Angular
                ├── services/
                │   └── api.ts      # Servicio para API REST
                ├── dashboard/      # Componente dashboard
                ├── productos/      # Componente productos
                ├── clientes/       # Componente clientes
                └── ventas/         # Componente ventas
```

## Requisitos

- Python 3.12+ (Django 6 no funciona con versiones anteriores)
- Django 6.0.3
- Django REST Framework
- PostgreSQL
- Node.js 20+ (recomendado: versión LTS)
- Git

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

Todos los comandos se ejecutan en PowerShell desde la carpeta raíz del repositorio (`urban`).

### 1. Clonar el proyecto

```powershell
git clone https://github.com/Alexyulian19/urban.git
cd urban
```

### 2. Crear la base de datos

En pgAdmin o en psql, con el usuario `postgres`:

```sql
CREATE DATABASE "bd_AlmacenRopa_corregido";
```

### 3. Backend (Django)

1. Crear y activar el entorno virtual:
   ```powershell
   py -m venv env
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   .\env\Scripts\Activate.ps1
   ```

2. Instalar dependencias:
   ```powershell
   pip install -r docs\requirements.txt
   ```

3. Ejecutar migraciones:
   ```powershell
   cd proyectoalmacenropa
   python manage.py migrate
   ```

4. Cargar los datos de prueba (primero productos, después clientes y ventas):
   ```powershell
   python manage.py loaddata datos_productos.json
   python manage.py loaddata datos_clientes_ventas.json
   ```

5. Crear los usuarios del sistema:
   ```powershell
   python manage.py crear_usuarios
   ```
   Crea `admin` / `Admin2026*` (administrador) y `vendedor` / `Vendedor2026*` (vendedor). Cambie las contraseñas iniciales con `python manage.py crear_usuarios --admin-pass NUEVA --vendedor-pass NUEVA` o desde `/admin/`.

6. Crear un superusuario para el panel de Django (opcional):
   ```powershell
   python manage.py createsuperuser
   ```

7. Iniciar el servidor de desarrollo:
   ```powershell
   python manage.py runserver
   ```
   El servidor estará disponible en `http://127.0.0.1:8000/`

### 4. Frontend (Angular)

1. Instalar dependencias (en otra terminal, desde la carpeta `urban`):
   ```powershell
   cd proyectoalmacenropa\frontend-ropa
   npm install
   ```

2. Iniciar el servidor de desarrollo:
   ```powershell
   npm start
   ```
   La aplicación estará disponible en `http://localhost:4200/`

#### Componentes implementados

- **Dashboard** (`/`) - Panel principal con indicadores, estado del inventario y últimas ventas
- **Productos** (`/productos`) - Gestión de productos
- **Clientes** (`/clientes`) - Gestión de clientes
- **Ventas** (`/ventas`) - Registro e historial de ventas

#### Servicio API

`ApiService` maneja la comunicación HTTP con el backend:

- `getProductos()`, `crearProducto()` - Operaciones con productos
- `getClientes()`, `crearCliente()` - Operaciones con clientes
- `getVentas()`, `crearVenta()` - Operaciones con ventas

La URL base del API está configurada en `http://127.0.0.1:8000/api`.

Este frontend utiliza `provideHttpClient()` en `src/app/app.config.ts`, por lo que el servicio HTTP está integrado en la configuración de la aplicación.

## Configuración de la base de datos

La configuración usa PostgreSQL con los siguientes valores (en `ropa_almacen/settings.py`), que también pueden definirse con variables de entorno:

- **ENGINE**: `django.db.backends.postgresql`
- **NAME**: `bd_AlmacenRopa_corregido` (variable `DB_NAME`)
- **USER**: `postgres` (variable `DB_USER`)
- **PASSWORD**: `1234` (variable `DB_PASSWORD`)
- **HOST**: `127.0.0.1` (variable `DB_HOST`)
- **PORT**: `5432` (variable `DB_PORT`)

> Cambia estos valores para tu entorno local o de producción.

## Configuración de la aplicación

- **IDIOMA**: Español (Colombia) - `es-co`
- **ZONA HORARIA**: America/Bogota
- **CORS**: Limitado al frontend
- **SECRET_KEY, DEBUG y ALLOWED_HOSTS**: configurables por variables de entorno

### Apps instaladas

- Django (admin, auth, contenttypes, sessions, messages, staticfiles)
- `rest_framework` - API REST
- `corsheaders` - soporte CORS
- `almacen` - app de negocio

## Modelos principales

### Cliente

Campos:

- `nombre` - `CharField(max_length=100)`
- `email` - `EmailField()`, único
- `telefono` - `CharField(max_length=20)`, solo números
- `direccion` - `TextField()`

Representa a los clientes que realizan compras.

### Producto

Campos:

- `nombre` - `CharField(max_length=100)`
- `descripcion` - `TextField(blank=True)`, usado para la marca
- `precio` - `DecimalField(max_digits=10, decimal_places=2)`, no negativo
- `stock` - `IntegerField()`, no negativo

Representa los artículos de ropa disponibles en inventario.

### Venta

Campos:

- `cliente` - `ForeignKey(Cliente, on_delete=models.PROTECT)`
- `producto` - `ForeignKey(Producto, on_delete=models.PROTECT)`
- `cantidad` - `IntegerField()`
- `fecha` - `DateTimeField(auto_now_add=True)`
- `total` - `DecimalField(max_digits=10, decimal_places=2)`, calculado por el servidor

Registra una operación de venta. Con `PROTECT` no se puede eliminar un cliente o un producto que tenga ventas registradas.

## Estado actual

- ✅ Backend Django configurado con `ropa_almacen` como módulo de configuración.
- ✅ App `almacen` registrada en `INSTALLED_APPS`.
- ✅ Django REST Framework integrado con viewsets y routers.
- ✅ Serializers implementados para `Cliente`, `Producto` y `Venta`.
- ✅ API REST completa con endpoints CRUD para todas las entidades.
- ✅ Autenticación con token y dos roles: vendedor y administrador.
- ✅ CORS limitado al frontend.
- ✅ Frontend Angular (`frontend-ropa`) con interfaz completa: menú lateral, panel con indicadores, formularios y tablas con etiquetas de estado de existencias.
- ✅ Servicio API implementado para comunicación HTTP.
- ✅ Rutas configuradas en backend (`/api/`) y frontend.
- ✅ El frontend utiliza `provideHttpClient()` y router standalone.
- ✅ Pruebas automáticas del backend: `python manage.py test almacen` (16 pruebas).

## Cómo ejecutar el proyecto

### Opción 1: Ejecutar solo el backend

1. Activar el entorno virtual.
2. Iniciar el servidor:
   ```powershell
   cd proyectoalmacenropa
   python manage.py runserver
   ```

### Opción 2: Ejecutar backend + frontend

**Terminal 1 (Backend):**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\env\Scripts\Activate.ps1
cd proyectoalmacenropa
python manage.py runserver
```

**Terminal 2 (Frontend):**
```powershell
cd proyectoalmacenropa\frontend-ropa
npm start
```

Una vez ejecutándose ambos servidores:
- Backend API: `http://127.0.0.1:8000/api/`
- Frontend: `http://localhost:4200/`
- Admin Django: `http://127.0.0.1:8000/admin/`

## API REST

El backend expone una API REST completa a través de Django REST Framework. Todos los endpoints exigen iniciar sesión con token.

- **Admin**: `http://127.0.0.1:8000/admin/`
- **API base**: `http://127.0.0.1:8000/api/`

### Endpoints disponibles

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/clientes/` | GET | Listar todos los clientes |
| `/api/clientes/` | POST | Crear nuevo cliente |
| `/api/clientes/{id}/` | GET | Obtener cliente específico |
| `/api/clientes/{id}/` | PUT | Actualizar cliente |
| `/api/clientes/{id}/` | DELETE | Eliminar cliente (administrador) |
| `/api/productos/` | GET | Listar todos los productos |
| `/api/productos/` | POST | Crear nuevo producto |
| `/api/productos/{id}/` | GET | Obtener producto específico |
| `/api/productos/{id}/` | PUT | Actualizar producto |
| `/api/productos/{id}/` | DELETE | Eliminar producto (administrador) |
| `/api/ventas/` | GET | Listar todas las ventas |
| `/api/ventas/` | POST | Registrar nueva venta |
| `/api/ventas/{id}/` | GET | Obtener venta específica |
| `/api/ventas/{id}/` | PUT | Editar venta (administrador) |
| `/api/ventas/{id}/` | DELETE | Anular venta (administrador) |

### Consultas

- Búsqueda en productos, clientes y ventas: `?search=texto`
- Historial por cliente: `/api/ventas/?cliente=ID`
- Filtro por fechas: `/api/ventas/?desde=AAAA-MM-DD&hasta=AAAA-MM-DD`
- Paginación opcional: `?page=1`

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

La aplicación solo acepta solicitudes desde el frontend. Para producción, ajuste `CORS_ALLOWED_ORIGINS` en `settings.py`.

## Correcciones aplicadas (octubre 2026)

Después de las pruebas del sistema se hicieron estas correcciones:

- **Ventas y stock:** al registrar una venta el servidor descuenta las unidades del producto, rechaza la venta si no hay existencias suficientes o la cantidad no es válida, y calcula el total (el navegador ya no lo envía). Editar una venta reajusta el stock y anularla devuelve las unidades al inventario.
- **Historial protegido:** no se puede eliminar un cliente o un producto que tenga ventas (`on_delete=PROTECT`); el sistema responde con un mensaje claro.
- **Seguridad:** la API exige iniciar sesión (token). Hay dos roles: *vendedor* (consulta y registra) y *administrador* (además edita/anula ventas y elimina registros). CORS limitado al frontend. `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS` y la conexión a PostgreSQL se pueden definir por variables de entorno.
- **Validaciones:** precio y stock no negativos, teléfono solo con números, correo único, productos duplicados, caracteres `<` y `>` rechazados. En Angular los campos inválidos se marcan en rojo con su mensaje.
- **Consultas:** búsqueda en productos, clientes y ventas (`?search=`), historial por cliente (`/api/ventas/?cliente=ID`), filtro por fechas (`?desde=AAAA-MM-DD&hasta=AAAA-MM-DD`) y paginación opcional (`?page=1`). El historial muestra fecha, vendedor y precios en pesos.
- **Interfaz:** rediseño del frontend con menú lateral, barra superior con buscador, tarjetas de indicadores y etiquetas de estado de existencias (Disponible, Stock bajo y Agotado; stock bajo = 5 unidades o menos).
- **Pruebas automáticas del backend:** `python manage.py test almacen` (16 pruebas).

## Próximos pasos recomendados

### Pendientes del sistema
- Talla, categoría (busos, jeans, bermudas, camisas, gorras, tenis, ropa interior) y género del producto.
- Cédula del cliente y programa de fidelización.
- Revisar y ajustar el diseño responsive para celular.
- Actualizar los archivos `.spec.ts` de Angular, que no compilan.
- Implementar exportación de datos (PDF, Excel).

### Seguridad y despliegue
- Cambiar las contraseñas iniciales de `admin` y `vendedor`.
- Ajustar `DEBUG = False` en producción.
- Configurar `ALLOWED_HOSTS` y `CORS_ALLOWED_ORIGINS`.
- Usar variables de entorno para credenciales, no dejarlas en el código.
- Evaluar despliegue (Azure, Railway, Render, etc.).