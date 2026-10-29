import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api';
import { AuthService } from '../services/auth';
import { mensajeError } from '../services/errores';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css'
})
export class ClientesComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);

  clientes: any[] = [];
  busqueda = '';
  mensaje = '';
  error = '';
  errorCarga = '';
  intentoGuardar = false;
  guardando = false;

  nuevoCliente = { nombre: '', email: '', telefono: '', direccion: '' };
  clienteEditandoId: number | null = null;

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.api.getClientes(this.busqueda).subscribe({
      next: (data) => {
        this.clientes = data;
        this.errorCarga = '';
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.clientes = [];
        this.errorCarga = mensajeError(error);
        this.cdr.detectChanges();
      }
    });
  }

  get errNombre(): string {
    return this.nuevoCliente.nombre.trim() ? '' : 'Escriba el nombre del cliente.';
  }
  get errEmail(): string {
    const e = this.nuevoCliente.email.trim();
    if (!e) return 'Escriba el correo.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? '' : 'El correo no tiene un formato válido.';
  }
  get errTelefono(): string {
    const t = this.nuevoCliente.telefono.trim();
    if (!t) return 'Escriba el teléfono.';
    return /^\+?\d{7,15}$/.test(t) ? '' : 'El teléfono solo puede tener números (7 a 15 dígitos).';
  }
  get errDireccion(): string {
    return this.nuevoCliente.direccion.trim() ? '' : 'Escriba la dirección.';
  }
  get formularioValido(): boolean {
    return !this.errNombre && !this.errEmail && !this.errTelefono && !this.errDireccion;
  }

  guardarCliente(): void {
    this.intentoGuardar = true;
    this.mensaje = '';
    this.error = '';
    if (!this.formularioValido) {
      this.error = 'Revise los campos marcados en rojo.';
      return;
    }
    this.guardando = true;
    const peticion = this.clienteEditandoId
      ? this.api.actualizarCliente(this.clienteEditandoId, this.nuevoCliente)
      : this.api.crearCliente(this.nuevoCliente);

    peticion.subscribe({
      next: () => {
        this.mensaje = this.clienteEditandoId ? 'Cliente actualizado correctamente.' : 'Cliente agregado correctamente.';
        this.limpiarFormulario(false);
        this.cargarClientes();
      },
      error: (error) => {
        this.error = mensajeError(error);
        this.guardando = false;
        this.cdr.detectChanges();
      }
    });
  }

  editarCliente(cliente: any): void {
    this.clienteEditandoId = cliente.id;
    this.mensaje = '';
    this.error = '';
    this.nuevoCliente = {
      nombre: cliente.nombre,
      email: cliente.email,
      telefono: cliente.telefono,
      direccion: cliente.direccion
    };
    this.cdr.detectChanges();
  }

  eliminarCliente(cliente: any): void {
    if (!confirm(`¿Seguro que quiere eliminar a ${cliente.nombre}?`)) return;
    this.mensaje = '';
    this.error = '';
    this.api.eliminarCliente(cliente.id).subscribe({
      next: () => {
        this.mensaje = 'Cliente eliminado correctamente.';
        this.cargarClientes();
      },
      error: (error) => {
        this.error = mensajeError(error);
        this.cdr.detectChanges();
      }
    });
  }

  limpiarFormulario(borrarMensajes = true): void {
    this.clienteEditandoId = null;
    this.intentoGuardar = false;
    this.guardando = false;
    if (borrarMensajes) {
      this.mensaje = '';
      this.error = '';
    }
    this.nuevoCliente = { nombre: '', email: '', telefono: '', direccion: '' };
    this.cdr.detectChanges();
  }
}
