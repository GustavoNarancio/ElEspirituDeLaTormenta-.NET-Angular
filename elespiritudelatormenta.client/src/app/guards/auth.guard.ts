import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(): boolean {
    // 1. Nos fijamos si existe el ID en la memoria
    const idGuardado = localStorage.getItem('idUsuarioActual');

    if (idGuardado) {
      // 2. Si tiene ID, le abrimos la puerta (true)
      return true;
    } else {
      // 3. Si NO tiene ID, lo pateamos al login y le cerramos la puerta (false)
      // Usamos replaceUrl para que no pueda volver atrás
      this.router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  }
}
