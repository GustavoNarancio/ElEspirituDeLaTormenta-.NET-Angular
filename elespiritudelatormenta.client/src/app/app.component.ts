import { Component, OnInit, HostListener } from '@angular/core';
import { EventosGlobalesService } from './services/eventos-globales.service';
import { AudioService } from './services/audio.service'; // <-- Importamos el audio

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ElespiritudelatormentaClient';

  // Variable para la mochila
  mensajeAlerta: string | null = null;

  // Variable para que la música no le dé Play mil veces
  musicaIniciada: boolean = false;

  // Inyectamos los DOS servicios acá
  constructor(
    private eventosService: EventosGlobalesService,
    private audioService: AudioService
  ) { }

  ngOnInit() {
    // Lógica de tu mochila y contador (Intacta)
    this.eventosService.inicializarContador();

    this.eventosService.alertaMochila.subscribe(msj => {
      this.mensajeAlerta = msj;
      setTimeout(() => this.mensajeAlerta = null, 3000);
    });
  }

  // Escuchador global de clicks para la música
  @HostListener('document:click')
  arrancarMusicaGlobal() {
    if (!this.musicaIniciada && localStorage.getItem('idUsuarioActual')) {
      this.audioService.reproducirMusica();
      this.musicaIniciada = true;
    }
  }
}

