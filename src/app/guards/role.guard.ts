import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredPage = route.data['requiredPage'];

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredPage && !authService.hasPageAccess(requiredPage)) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};

