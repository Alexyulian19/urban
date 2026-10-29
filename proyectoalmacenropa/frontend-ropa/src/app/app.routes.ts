import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { ProductosComponent } from './productos/productos';
import { ClientesComponent } from './clientes/clientes';
import { VentasComponent } from './ventas/ventas';
import { LoginComponent } from './login/login';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', pathMatch: 'full', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'productos', component: ProductosComponent, canActivate: [authGuard] },
  { path: 'clientes', component: ClientesComponent, canActivate: [authGuard] },
  { path: 'ventas', component: VentasComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
