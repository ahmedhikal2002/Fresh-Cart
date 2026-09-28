import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { EMPTY } from 'rxjs';
import { AuthService } from '../../services/auth/auth-service';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {
  const ID = inject(PLATFORM_ID);
  const authService = inject(AuthService);
  const isProtectedRoute =
    req.url.includes('cart') ||
    req.url.includes('wishlist') ||
    req.url.includes('orders') ||
    req.url.includes('users') ||
    req.url.includes('auth') ||
    req.url.includes('addresses') ||
    req.url.includes('reviews');

  if (isProtectedRoute && !isPlatformBrowser(ID)) {
    return EMPTY;
  }

  if (isPlatformBrowser(ID)) {
    const token = authService.getUserToken();

    if (token && isProtectedRoute) {
      req = req.clone({
        headers: req.headers.set('token', token),
      });
    }
  }
  return next(req);
};
