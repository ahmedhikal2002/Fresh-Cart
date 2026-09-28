import { inject } from '@angular/core';
import { ActivatedRoute, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth-service';

export const loginGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUSerLoggedIn()) {
    const returnUrl = route.queryParamMap.get('returnUrl');

    return router.parseUrl(returnUrl || '/home');
  }

  return true;
};
