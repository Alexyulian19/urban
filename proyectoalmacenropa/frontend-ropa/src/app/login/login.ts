import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { mensajeError } from '../services/errores';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  usuario = '';
  clave = '';
  error = '';
  cargando = false;

  ingresar(): void {
    this.error = '';
    if (!this.usuario.trim() || !this.clave) {
      this.error = 'Escriba su usuario y su contraseña.';
      return;
    }
    this.cargando = true;
    this.auth.login(this.usuario.trim(), this.clave).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => {
        this.error = mensajeError(e);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}
