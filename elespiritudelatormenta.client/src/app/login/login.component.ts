import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { AudioService } from "../services/audio.service"; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  nombreJugador: string = '';
  mensajeError: string = '';

  constructor(private apiService: ApiService, private router: Router, private audioService: AudioService) {
    // El Patovica interno: si el usuario ya tiene un ID guardado, lo mandamos directo al juego.
    if (localStorage.getItem('idUsuarioActual')) {
      this.router.navigate(['/intro'], { replaceUrl: true });
    }
  }

  ingresar() {
    // 1. Validamos que no esté vacío
    if (this.nombreJugador.trim() === '') {
      this.mensajeError = 'El nombre no puede estar vacío.';
      return;
    }

    // 2. Llamamos a nuestro ApiService (que habla con C#)
    this.apiService.iniciarSesion(this.nombreJugador).subscribe({
      next: (res) => {
        // 3. ¡LA MAGIA! Guardamos el ID que nos devolvió C# en la memoria del navegador
        localStorage.setItem('idUsuarioActual', res.id.toString());
        this.audioService.reproducirMusica();
        // 4. Lo mandamos al juego y borramos el historial (replaceUrl: true)
        this.router.navigate(['/intro'], { replaceUrl: true });
      },

      // --- ACÁ ESTÁ EL CAMBIO ---
      error: (err) => {
        // Nos fijamos si el error viene con un mensaje desde C# (ej: "Ese nombre ya está en uso")
        if (err.error && err.error.mensaje) {
          this.mensajeError = err.error.mensaje;
        } else {
          // Si es un error raro o se cayó internet, mostramos el genérico
          this.mensajeError = 'Hubo un error de conexión con el servidor.';
        }
      }
      // ---------------------------

    });
  }
}
