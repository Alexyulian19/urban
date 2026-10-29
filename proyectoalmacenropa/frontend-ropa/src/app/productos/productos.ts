import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';
import { AuthService } from '../services/auth';
import { mensajeError } from '../services/errores';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);

  productos: any[] = [];
  busqueda = '';
  mensaje = '';
  error = '';
  errorCarga = '';
  intentoGuardar = false;
  guardando = false;

  nuevoProducto: { nombre: string; descripcion: string; precio: number | null; stock: number | null } = {
    nombre: '',
    descripcion: '',
    precio: null,
    stock: null
  };

  productoEditandoId: number | null = null;

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.api.getProductos(this.busqueda).subscribe({
      next: (data) => {
        this.productos = data;
        this.errorCarga = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.productos = [];
        this.errorCarga = mensajeError(error);
        this.cdr.detectChanges();
      }
    });
  }

  // Validaciones del formulario (antes de ir al servidor)
  get errNombre(): string {
    return this.nuevoProducto.nombre.trim() ? '' : 'Escriba el nombre del producto.';
  }
  get errPrecio(): string {
    const p = this.nuevoProducto.precio;
    if (p === null || p === undefined || (p as any) === '') return 'Escriba el precio.';
    return p < 0 ? 'El precio no puede ser negativo.' : '';
  }
  get errStock(): string {
    const s = this.nuevoProducto.stock;
    if (s === null || s === undefined || (s as any) === '') return 'Escriba la cantidad en stock.';
    if (s < 0) return 'El stock no puede ser negativo.';
    return Number.isInteger(Number(s)) ? '' : 'El stock debe ser un número entero.';
  }
  get formularioValido(): boolean {
    return !this.errNombre && !this.errPrecio && !this.errStock;
  }

  guardarProducto(): void {
    this.intentoGuardar = true;
    this.mensaje = '';
    this.error = '';
    if (!this.formularioValido) {
      this.error = 'Revise los campos marcados en rojo.';
      return;
    }
    this.guardando = true;
    const peticion = this.productoEditandoId
      ? this.api.actualizarProducto(this.productoEditandoId, this.nuevoProducto)
      : this.api.crearProducto(this.nuevoProducto);

    peticion.subscribe({
      next: () => {
        this.mensaje = this.productoEditandoId ? 'Producto actualizado correctamente.' : 'Producto agregado correctamente.';
        this.limpiarFormulario(false);
        this.cargarProductos();
      },
      error: (error) => {
        this.error = mensajeError(error);
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  editarProducto(producto: any): void {
    this.productoEditandoId = producto.id;
    this.mensaje = '';
    this.error = '';
    this.nuevoProducto = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: Number(producto.precio),
      stock: producto.stock
    };
    this.cdr.detectChanges();
  }

  eliminarProducto(producto: any): void {
    if (!confirm(`¿Seguro que quiere eliminar "${producto.nombre}"?`)) return;
    this.mensaje = '';
    this.error = '';
    this.api.eliminarProducto(producto.id).subscribe({
      next: () => {
        this.mensaje = 'Producto eliminado correctamente.';
        this.cargarProductos();
      },
      error: (error) => {
        this.error = mensajeError(error);
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(borrarMensajes = true): void {
    this.productoEditandoId = null;
    this.intentoGuardar = false;
    this.guardando = false;
    if (borrarMensajes) {
      this.mensaje = '';
      this.error = '';
    }
    this.nuevoProducto = { nombre: '', descripcion: '', precio: null, stock: null };
    this.cdr.detectChanges();
  }
}
