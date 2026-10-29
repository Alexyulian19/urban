import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  private params(busqueda?: string, extra: Record<string, string> = {}): HttpParams {
    let p = new HttpParams({ fromObject: extra });
    if (busqueda && busqueda.trim()) {
      p = p.set('search', busqueda.trim());
    }
    return p;
  }

  // PRODUCTOS
  getProductos(busqueda?: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/productos/`, { params: this.params(busqueda) });
  }

  crearProducto(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/productos/`, data);
  }

  actualizarProducto(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/productos/${id}/`, data);
  }

  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/productos/${id}/`);
  }

  // CLIENTES
  getClientes(busqueda?: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/clientes/`, { params: this.params(busqueda) });
  }

  crearCliente(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/clientes/`, data);
  }

  actualizarCliente(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/clientes/${id}/`, data);
  }

  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/clientes/${id}/`);
  }

  // VENTAS
  getVentas(busqueda?: string, clienteId?: string): Observable<any> {
    const extra: Record<string, string> = clienteId ? { cliente: clienteId } : {};
    return this.http.get(`${this.baseUrl}/ventas/`, { params: this.params(busqueda, extra) });
  }

  crearVenta(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ventas/`, data);
  }

  actualizarVenta(id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/ventas/${id}/`, data);
  }

  eliminarVenta(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/ventas/${id}/`);
  }
}
