import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private musicaFondo = new Audio();

  constructor() {
    this.musicaFondo.src = '/assets/Intro.mp3'; // Asegurate de que el archivo esté en tu carpeta assets
    this.musicaFondo.loop = true; // Para que se repita infinitamente
    this.musicaFondo.volume = 0.25; // 40% de volumen para que no tape los efectos de sonido ni aturda
  }

  reproducirMusica() {
    // Le decimos que arranque. El catch() atrapa cualquier error del navegador.
    this.musicaFondo.play().catch(err => console.log('Autoplay bloqueado por el navegador', err));
  }

  detenerMusica() {
    this.musicaFondo.pause();
    this.musicaFondo.currentTime = 0; // Lo reinicia al principio
  }
}
