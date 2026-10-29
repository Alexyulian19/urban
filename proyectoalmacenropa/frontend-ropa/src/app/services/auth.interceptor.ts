import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token;
  const peticion = token && !req.url.endsWith('/login/')
    ? req.clone({ setHeaders: { Authorization: `Token ${token}` } })
    : req;

  return next(peticion).pipe(
    catchError((error) => {
      if (error.status === 401 && !req.url.endsWith('/login/')) {
        auth.cerrarLocal();
      }
      return throwError(() => error);
    })
  );
};
