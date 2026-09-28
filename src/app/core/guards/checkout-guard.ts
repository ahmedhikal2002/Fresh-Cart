import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CartService } from '../services/cart/cart-service';
import { isPlatformBrowser } from '@angular/common';
import { map, catchError, of } from 'rxjs';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const cartService = inject(CartService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  return cartService.getLoggedUserCart().pipe(
    map((res) => {
      cartService.cart.set(res.data);
      if (!res.data || res.data.products.length === 0) {
        router.navigate(['/cart']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    }),
  );
};
