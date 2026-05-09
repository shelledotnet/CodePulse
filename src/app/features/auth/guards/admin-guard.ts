import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = authService.user();
  if (!user) {
    router.navigate(["/login"]);
    return false;
  }
  const iswriter = user.roles.includes("writer");
  if (!iswriter) {
    authService.logout();
    return false;
  }
  return true;
};
