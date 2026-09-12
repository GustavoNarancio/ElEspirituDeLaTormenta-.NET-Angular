import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ApiService } from './api.service';

export interface EventoJuego {
  texto: string;
  esFinal: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EventosGlobalesService {

  public eventoDisparado = new Subject<EventoJuego>();
  private contadorAcciones: number = 0;

  // NUEVO: Subject para la alerta de la mochila
  public alertaMochila = new Subject<string>();

  private umbralesEventos: { [key: number]: string } = {
    50: "Te detienes en seco. Escuchas una fuerte pisada alrededor de la cabaña.",
    60: "Definitivamente, la bestia está merodeando cada vez más cerca.",
    80: "El estallido de un vidrio roto resuena en el aire... y sabes muy bien que no fue por la tormenta.",
    100: "Las paredes empiezan a temblar. Un rugido ensordecedor te aturde; es evidente que quiere entrar.",
    120: "Los rugidos y los golpes contra la madera ya son insoportables. No sabes cuánto tiempo te queda antes de que logre entrar.",
    140: "Su presencia es abrumadora. Sea lo que sea que la mantenía afuera, ya no funciona. Estás en grave peligro.",
    160: "Tienes que encontrar una salida YA. El tiempo se acaba.",
    180: "LO INEVITABLE SUCEDE... LA BESTIA ESTÁ EN LA CABAÑA"
  };

  // FIX: Ajustamos el límite final para que coincida con tu último texto
  private limiteFinal: number = 180;

  constructor(private apiService: ApiService) { }

  // FIX: Función para obtener el ID real (evitamos que quede en 1)
  private getUsuarioActual(): number {
    const usuarioStorage = localStorage.getItem('idUsuarioActual');
    return usuarioStorage ? parseInt(usuarioStorage, 10) : 1;
  }

  // 1. Carga inicial
  inicializarContador() {
    this.apiService.getMovimientos(this.getUsuarioActual()).subscribe({
      next: (movimientos) => {
        this.contadorAcciones = movimientos;
      },
      error: (err) => console.error("Error al cargar los movimientos desde la DB", err)
    });
  }

  // 2. Sumar acción
  sumarAccion() {
    this.contadorAcciones++;

    this.apiService.actualizarMovimientos(this.getUsuarioActual(), this.contadorAcciones).subscribe({
      next: () => {
        this.chequearEventos();
      },
      error: (err) => console.error("Error al actualizar movimientos en la DB", err)
    });
  }

  // NUEVA FUNCION: Dispara la alerta visual
  mostrarAlertaMochila(mensaje: string) {
    this.alertaMochila.next(mensaje);
  }

  private chequearEventos() {
    const textoEvento = this.umbralesEventos[this.contadorAcciones];

    if (textoEvento) {
      // Si llega al límite o lo pasa, marcamos que es el final
      const esElFinal = this.contadorAcciones >= this.limiteFinal;

      this.eventoDisparado.next({
        texto: textoEvento,
        esFinal: esElFinal
      });
    }
  }
}
