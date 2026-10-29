import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth';

// Opciones del menú lateral (también se usan para las migas de pan y el buscador superior)
const SECCIONES: Record<string, string> = {
  '/': 'Panel',
  '/productos': 'Productos',
  '/clientes': 'Clientes',
  '/ventas': 'Ventas'
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  get enLogin(): boolean {
    return this.router.url.startsWith('/login');
  }

  /** Nombre de la sección actual, para las migas de pan. */
  get seccion(): string {
    return SECCIONES[this.router.url.split(/[?#]/)[0]] ?? 'Panel';
  }

  /** Iniciales del usuario para el avatar. */
  get iniciales(): string {
    const nombre = this.auth.sesion?.nombre?.trim() || '?';
    return nombre.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();
  }

  /** Buscador superior: lleva a la sección cuyo nombre coincida con lo escrito. */
  irA(texto: string): void {
    const t = texto.trim().toLowerCase();
    if (!t) return;
    const ruta = Object.keys(SECCIONES).find((r) => SECCIONES[r].toLowerCase().startsWith(t));
    if (ruta) this.router.navigate([ruta]);
  }

  salir(): void {
    this.auth.logout();
  }
}
