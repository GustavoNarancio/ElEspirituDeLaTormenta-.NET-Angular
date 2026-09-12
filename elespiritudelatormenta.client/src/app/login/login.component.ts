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
  cargando: boolean = false; // Agregamos un flag de carga

  constructor(private apiService: ApiService, private router: Router, private audioService: AudioService) {
    // Si llegó hasta acá por voluntad propia (ej: recargó la URL /login), 
    // nos aseguramos de que no tenga un ID viejo escondido.
    if (localStorage.getItem('idUsuarioActual')) {
      // Opcional: Podrías mandarlo al juego, o forzar la limpieza.
      // Como queremos evitar bugs, si llega a la ruta /login explicitamente, limpiamos.
      localStorage.removeItem('idUsuarioActual');
    }
  }

  ingresar() {
    this.mensajeError = '';

    if (this.nombreJugador.trim() === '') {
      this.mensajeError = 'El nombre no puede estar vacío.';
      return;
    }

    this.cargando = true;

    this.apiService.iniciarSesion(this.nombreJugador).subscribe({
      next: (res) => {
        this.cargando = false;
        // Limpiamos todo antes de setear el nuevo para evitar solapamientos
        localStorage.clear();
        localStorage.setItem('idUsuarioActual', res.id.toString());
        this.audioService.reproducirMusica();
        this.router.navigate(['/intro'], { replaceUrl: true });
      },
      error: (err) => {
        this.cargando = false;
        if (err.error && err.error.mensaje) {
          this.mensajeError = err.error.mensaje;
        } else {
          this.mensajeError = 'Hubo un error de conexión con el servidor.';
        }
      }
    });
  }
}
