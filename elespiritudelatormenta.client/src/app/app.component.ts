import { Component, OnInit } from '@angular/core';
import { EventosGlobalesService } from './services/eventos-globales.service'; // Revisá que la ruta coincida

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'ElespiritudelatormentaClient';

  // NUEVA VARIABLE: Guarda el texto de la alerta
  mensajeAlerta: string | null = null;

  constructor(private eventosService: EventosGlobalesService) { }

  ngOnInit() {
    // Al cargar la app (o tocar F5), recuperamos el contador de la DB
    this.eventosService.inicializarContador();

    // NUEVO: Escuchamos el canal de alertas de la mochila
    this.eventosService.alertaMochila.subscribe(msj => {
      this.mensajeAlerta = msj;
      // Borramos la alerta automáticamente a los 3 segundos (3000 milisegundos)
      setTimeout(() => this.mensajeAlerta = null, 3000);
    });
  }
}
