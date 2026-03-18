// src/app/juego/juego.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent {

  mostrarMapa: boolean = false; // El mapa empieza oculto

  // Función para abrir el mapa
  abrirMapa() {
    this.mostrarMapa = true;
  }

  // Función para cerrar el mapa
  cerrarMapa() {
    this.mostrarMapa = false;
  }
}
