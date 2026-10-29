# Almacén Urban – Sistema de inventario

Sistema web para gestionar el inventario, los clientes y las ventas de un almacén de ropa para hombre.

- **Backend:** Django 6 + Django REST Framework
- **Frontend:** Angular
- **Base de datos:** PostgreSQL

## Requisitos

- Python 3.12 o superior
- Node.js (versión LTS)
- PostgreSQL
- Git

## Instalación

### 1. Clonar el proyecto

    git clone https://github.com/Alexyulian19/urban.git
    cd urban

### 2. Crear la base de datos

En pgAdmin o en psql, con el usuario postgres:

    CREATE DATABASE "bd_AlmacenRopa_corregido";

La conexión se configura en proyectoalmacenropa/ropa_almacen/settings.py. Por defecto usa el usuario postgres, la contraseña 1234, el host 127.0.0.1 y el puerto 5432. Si su PostgreSQL usa otros datos, cámbielos ahí.

### 3. Backend (Django)

Desde la carpeta urban:

    py -m venv env
    Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
    env\Scripts\activate
    pip install -r docs\requirements.txt
    cd proyectoalmacenropa
    python manage.py migrate
    python manage.py loaddata datos_productos.json
    python manage.py createsuperuser
    python manage.py runserver

La API queda en http://127.0.0.1:8000/ y el panel de administración en http://127.0.0.1:8000/admin/.

Los datos de clientes y ventas no están en este repositorio porque contienen información personal. Si recibió el archivo datos_clientes_ventas.json, cópielo en la carpeta proyectoalmacenropa y ejecute, después de cargar los productos:

    python manage.py loaddata datos_clientes_ventas.json

### 4. Frontend (Angular)

En otra terminal, desde la carpeta urban:

    cd proyectoalmacenropa\frontend-ropa
    npm install
    npm start

El sistema abre en http://localhost:4200.

## Uso diario

1. **Backend:** activar el entorno (env\Scripts\activate), entrar a proyectoalmacenropa y ejecutar python manage.py runserver.
2. **Frontend:** entrar a proyectoalmacenropa\frontend-ropa y ejecutar npm start.

Para detener cualquiera de los dos, presione Ctrl + C en su terminal.
