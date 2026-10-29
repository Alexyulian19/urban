import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';
import { AuthService } from '../services/auth';
import { mensajeError } from '../services/errores';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.html',
  styleUrl: './ventas.css'
})
export class VentasComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);

  ventas: any[] = [];
  clientes: any[] = [];
  productos: any[] = [];

  busqueda = '';
  filtroCliente = '';
  mensaje = '';
  error = '';
  errorCarga = '';
  intentoGuardar = false;
  guardando = false;

  nuevaVenta: { cliente: string; producto: string; cantidad: number | null } = {
    cliente: '',
    producto: '',
    cantidad: 1
  };
  ventaEditandoId: number | null = null;
  cantidadOriginal = 0;
  productoOriginal = '';

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarClientes();
    this.cargarProductos();
  }

  cargarVentas(): void {
    this.api.getVentas(this.busqueda, this.filtroCliente).subscribe({
      next: (data) => {
        this.ventas = data;
        this.errorCarga = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.ventas = [];
        this.errorCarga = mensajeError(error);
        this.cdr.detectChanges();
      }
    });
  }

  cargarClientes(): void {
    this.api.getClientes().subscribe({
      next: (data) => { this.clientes = data; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  cargarProductos(): void {
    this.api.getProductos().subscribe({
      next: (data) => { this.productos = data; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  get productoSeleccionado(): any {
    return this.productos.find((p) => p.id == this.nuevaVenta.producto);
  }

  /** Unidades que se pueden vender (al editar, cuentan las de la venta original). */
  get disponible(): number {
    const p = this.productoSeleccionado;
    if (!p) return 0;
    const extra = this.ventaEditandoId && this.productoOriginal == this.nuevaVenta.producto ? this.cantidadOriginal : 0;
    return p.stock + extra;
  }

  get total(): number {
    const p = this.productoSeleccionado;
    return p ? Number(p.precio) * Number(this.nuevaVenta.cantidad || 0) : 0;
  }

  get errCliente(): string { return this.nuevaVenta.cliente ? '' : 'Seleccione el cliente.'; }
  get errProducto(): string { return this.nuevaVenta.producto ? '' : 'Seleccione el producto.'; }
  get errCantidad(): string {
    const c = Number(this.nuevaVenta.cantidad);
    if (!c || c < 1 || !Number.isInteger(c)) return 'La cantidad debe ser un número entero mayor que cero.';
    if (this.productoSeleccionado && c > this.disponible) {
      return `Stock insuficiente: solo hay ${this.disponible} unidades.`;
    }
    return '';
  }
  get formularioValido(): boolean {
    return !this.errCliente && !this.errProducto && !this.errCantidad;
  }

  guardarVenta(): void {
    this.intentoGuardar = true;
    this.mensaje = '';
    this.error = '';
    if (!this.formularioValido) {
      this.error = 'Revise los campos marcados en rojo.';
      return;
    }
    this.guardando = true;
    // El total no se envía: lo calcula el servidor.
    const datos = { cliente: this.nuevaVenta.cliente, producto: this.nuevaVenta.producto, cantidad: this.nuevaVenta.cantidad };
    const peticion = this.ventaEditandoId
      ? this.api.actualizarVenta(this.ventaEditandoId, datos)
      : this.api.crearVenta(datos);

    peticion.subscribe({
      next: () => {
        this.mensaje = this.ventaEditandoId ? 'Venta actualizada correctamente.' : 'Venta registrada correctamente.';
        this.limpiarFormulario(false);
        this.cargarVentas();
        this.cargarProductos(); // el stock cambió
      },
      error: (error) => {
        this.error = mensajeError(error);
        this.guardando = false;
        this.cargarProductos();
        this.cdr.detectChanges();
      }
    });
  }

  editarVenta(venta: any): void {
    this.ventaEditandoId = venta.id;
    this.cantidadOriginal = venta.cantidad;
    this.productoOriginal = String(venta.producto);
    this.mensaje = '';
    this.error = '';
    this.nuevaVenta = { cliente: String(venta.cliente), producto: String(venta.producto), cantidad: venta.cantidad };
    this.cdr.detectChanges();
  }

  eliminarVenta(venta: any): void {
    if (!confirm(`¿Anular la venta #${venta.id}? Las ${venta.cantidad} unidades volverán al inventario.`)) return;
    this.mensaje = '';
    this.error = '';
    this.api.eliminarVenta(venta.id).subscribe({
      next: () => {
        this.mensaje = 'Venta anulada. El stock fue devuelto al inventario.';
        this.cargarVentas();
        this.cargarProductos();
      },
      error: (error) => {
        this.error = mensajeError(error);
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(borrarMensajes = true): void {
    this.ventaEditandoId = null;
    this.intentoGuardar = false;
    this.guardando = false;
    this.cantidadOriginal = 0;
    this.productoOriginal = '';
    if (borrarMensajes) {
      this.mensaje = '';
      this.error = '';
    }
    this.nuevaVenta = { cliente: '', producto: '', cantidad: 1 };
    this.cdr.detectChanges();
  }
}
