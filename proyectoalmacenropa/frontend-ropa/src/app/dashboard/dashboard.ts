import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  private cdr = inject(ChangeDetectorRef);

  productos: any[] = [];
  clientes: any[] = [];
  ventas: any[] = [];

  totalProductos = 0;
  totalClientes = 0;
  totalVentas = 0;
  stockBajo = 0;

  cargandoProductos = true;
  cargandoClientes = true;
  cargandoVentas = true;

  errorProductos = '';
  errorClientes = '';
  errorVentas = '';

  ngOnInit(): void {
    this.cargarDashboard();
  }

  cargarDashboard(): void {
    this.cargarProductos();
    this.cargarClientes();
    this.cargarVentas();

    // Detecta cambios al iniciar la carga del dashboard
    this.cdr.detectChanges();
  }

  cargarProductos(): void {
    this.cargandoProductos = true;
    this.errorProductos = '';

    this.cdr.detectChanges();

    this.api.getProductos().subscribe({
      next: (data) => {
        
        this.productos = data || [];
        this.totalProductos = this.productos.length;
        this.stockBajo = this.productos.filter(
          (p: any) => Number(p.stock) <= 5
        ).length;

        this.cargandoProductos = false;

        // Detecta cambios después de cargar productos
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando productos:', error);

        this.errorProductos = 'No se pudieron cargar los productos.';
        this.cargandoProductos = false;

        // Detecta cambios si ocurre error
        this.cdr.detectChanges();
      }
    });
  }

  cargarClientes(): void {
    this.cargandoClientes = true;
    this.errorClientes = '';

    this.cdr.detectChanges();

    this.api.getClientes().subscribe({
      next: (data) => {
        
        this.clientes = data || [];
        this.totalClientes = this.clientes.length;
        this.cargandoClientes = false;

        // Detecta cambios después de cargar clientes
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando clientes:', error);

        this.errorClientes = 'No se pudieron cargar los clientes.';
        this.cargandoClientes = false;

        // Detecta cambios si ocurre error
        this.cdr.detectChanges();
      }
    });
  }

  cargarVentas(): void {
    this.cargandoVentas = true;
    this.errorVentas = '';

    this.cdr.detectChanges();

    this.api.getVentas().subscribe({
      next: (data) => {
        
        this.ventas = data || [];
        this.totalVentas = this.ventas.length;
        this.cargandoVentas = false;

        // Detecta cambios después de cargar ventas
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error cargando ventas:', error);

        this.errorVentas = 'No se pudieron cargar las ventas.';
        this.cargandoVentas = false;

        // Detecta cambios si ocurre error
        this.cdr.detectChanges();
      }
    });
  }

  /** Porcentaje de productos con más de 5 unidades. */
  get disponibilidad(): number {
    if (!this.productos.length) return 0;
    const ok = this.productos.filter((p: any) => Number(p.stock) > 5).length;
    return Math.round((ok / this.productos.length) * 100);
  }

  get conectado(): boolean {
    return !this.cargandoGeneral && !this.errorProductos && !this.errorClientes && !this.errorVentas;
  }

  get cargandoGeneral(): boolean {
    return this.cargandoProductos || this.cargandoClientes || this.cargandoVentas;
     }

  /** Productos sin unidades (stock en 0). */
  get agotados(): number {
    return this.productos.filter((p: any) => Number(p.stock) <= 0).length;
  }

  /** Cantidad de ventas de cada uno de los últimos 7 días (el último es hoy). */
  get ventasPorDia(): number[] {
    const dias = [0, 0, 0, 0, 0, 0, 0];
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    for (const v of this.ventas) {
      const fecha = new Date(v.fecha);
      fecha.setHours(0, 0, 0, 0);
      const atras = Math.round((hoy.getTime() - fecha.getTime()) / 86400000);
      if (atras >= 0 && atras < 7) dias[6 - atras]++;
    }
    return dias;
  }

  get ventasSemana(): number {
    return this.ventasPorDia.reduce((a, b) => a + b, 0);
  }

  /** Puntos de la minigráfica de ventas (lienzo de 100 x 40). */
  get puntosVentas(): string {
    const dias = this.ventasPorDia;
    const max = Math.max(...dias, 1);
    return dias.map((n, i) => `${(i * 100) / 6},${36 - (n / max) * 32}`).join(' ');
  }
}

