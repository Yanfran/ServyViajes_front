import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service'; // Supongo que tienes un servicio AuthService que maneja la autenticación y el rol del usuario.

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {

  userRole: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    
  }

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
    ): boolean | UrlTree {
    const expectedRole = route.data.expectedRole;
    this.userRole = this.authService.getUserRole();    

    // console.log("Tipo de rol esperado:", expectedRole);
    // console.log("Tipo de rol del usuario:", this.userRole);

    // Verifica si el usuario tiene al menos uno de los roles esperados
    if (Array.isArray(expectedRole) && expectedRole.includes(this.userRole)) {
      return true;
    } else if (this.userRole === expectedRole) {
      return true;
    } else {
      // Redirige al usuario a una página de acceso denegado o a donde desees.
      return this.router.parseUrl('/access-denied');
    }
  }
}
