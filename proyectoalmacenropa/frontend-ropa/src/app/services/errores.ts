import { HttpErrorResponse } from '@angular/common/http';

const nombresCampo: Record<string, string> = {
  nombre: 'Nombre', descripcion: 'Descripción', precio: 'Precio', stock: 'Stock',
  email: 'Correo', telefono: 'Teléfono', direccion: 'Dirección',
  cliente: 'Cliente', producto: 'Producto', cantidad: 'Cantidad'
};

/** Convierte cualquier error del backend en un mensaje que entienda el vendedor. */
export function mensajeError(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No hay conexión con el servidor. Verifique que el backend esté encendido.';
  }
  const cuerpo = error.error;
  if (cuerpo?.detail) {
    return cuerpo.detail;
  }
  if (cuerpo && typeof cuerpo === 'object') {
    return Object.entries(cuerpo)
      .map(([campo, msgs]) => {
        const texto = Array.isArray(msgs) ? msgs.join(' ') : String(msgs);
        return campo === 'non_field_errors' ? texto : `${nombresCampo[campo] ?? campo}: ${texto}`;
      })
      .join(' ');
  }
  return 'Ocurrió un error inesperado. Intente de nuevo.';
}
