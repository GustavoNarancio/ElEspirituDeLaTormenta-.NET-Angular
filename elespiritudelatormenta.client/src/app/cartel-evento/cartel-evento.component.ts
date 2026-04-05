import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EventosGlobalesService, EventoJuego } from '../services/eventos-globales.service';

@Component({
  selector: 'app-cartel-evento',
  templateUrl: './cartel-evento.component.html',
  styleUrls: ['./cartel-evento.component.css']
})
export class CartelEventoComponent implements OnInit, OnDestroy {

  eventoActual: EventoJuego | null = null;
  mostrarPantallaNegra: boolean = false;

  private suscripcion: Subscription = new Subscription();

  constructor(
    private eventosService: EventosGlobalesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.suscripcion = this.eventosService.eventoDisparado.subscribe((evento: EventoJuego) => {
      this.eventoActual = evento;
      this.mostrarPantallaNegra = false;
    });
  }

  cerrarCartel() {
    // Si hay un evento y es el final (20 movimientos)
    if (this.eventoActual && this.eventoActual.esFinal) {
      // En vez de cerrar, activamos la pantalla negra de Game Over
      this.mostrarPantallaNegra = true;
    } else {
      // Si era un cartel normal, cerramos todo y sigue jugando
      this.eventoActual = null;
    }
  }

  irAlFinal() {
    this.eventoActual = null;
    this.mostrarPantallaNegra = false;
    this.router.navigate(['/finalPorMovimientos']);
  }

  ngOnDestroy(): void {
    this.suscripcion.unsubscribe();
  }
}
