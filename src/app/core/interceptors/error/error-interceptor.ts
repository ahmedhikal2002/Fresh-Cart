import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../../services/Toast/toast-service';
import { AuthService } from '../../services/auth/auth-service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastService);
  const authService = inject(AuthService);
  const router = inject(Router);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 500) {
        toastr.ToastError('Server error, please try again later');
      } else if (err.status === 401) {
        const token = authService.getUserToken();

        if (token) {
          authService.logOut();
          toastr.ToastError('Session expired, please login again');
          router.navigate(['/login']);
        }
      } else if (err.status === 403) {
        toastr.ToastError('You do not have permission to perform this action');
      } else if (err.status === 0) {
        toastr.ToastError('Network error, please check your connection');
      }
      return throwError(() => err);
    }),
  );
};
