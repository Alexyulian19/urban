import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface Sesion {
  token: string;
  usuario: string;
  nombre: string;
  rol: 'administrador' | 'vendedor';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = 'http://127.0.0.1:8000/api';
  private clave = 'almacen_sesion';

  get sesion(): Sesion | null {
    const datos = localStorage.getItem(this.clave);
    return datos ? JSON.parse(datos) : null;
  }

  get token(): string | null {
    return this.sesion?.token ?? null;
  }

  get esAdmin(): boolean {
    return this.sesion?.rol === 'administrador';
  }

  get autenticado(): boolean {
    return !!this.token;
  }

  login(usuario: string, clave: string): Observable<Sesion> {
    return this.http
      .post<Sesion>(`${this.baseUrl}/login/`, { username: usuario, password: clave })
      .pipe(tap((s) => localStorage.setItem(this.clave, JSON.stringify(s))));
  }

  logout(): void {
    if (this.token) {
      this.http.post(`${this.baseUrl}/logout/`, {}).subscribe({ error: () => {} });
    }
    this.cerrarLocal();
  }

  cerrarLocal(): void {
    localStorage.removeItem(this.clave);
    this.router.navigate(['/login']);
  }
}
