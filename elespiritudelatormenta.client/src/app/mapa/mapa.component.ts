import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from '../services/eventos-globales.service';
@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent {

  @Output() cerrarMapa = new EventEmitter<void>();

  // Variable para controlar la pantalla negra del bosque
  mostrarPantallaBosque: boolean = false;

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService ) { }

  viajarHacia(destinoUrl: string) {
    this.eventosService.sumarAccion();
    this.router.navigate([destinoUrl]);
    this.cerrarMapa.emit();
  }

  // NUEVA LÓGICA PARA EL GARAJE
  viajarGaraje() {
    const idHabitacionFalsa = 5;
    const idPuzzlePuerta = 4;

    this.apiService.getPuzzles(idHabitacionFalsa).subscribe({
      next: (puzzles) => {
        const puzzlePuerta = puzzles.find(p => p.id === idPuzzlePuerta);

        if (puzzlePuerta && puzzlePuerta.resuelto) {
          this.viajarHacia('/garaje');
        } else {
          this.viajarHacia('/puerta-garaje');
        }
      },
      error: (err) => {
        console.error("Error al chequear estado de la puerta", err);
        this.viajarHacia('/puerta-garaje');
      }
    });
  }

  viajarSotano() {
    const idHabitacionFalsa = 5;
    const idPuzzlePuertaSotano = 5;

    this.apiService.getPuzzles(idHabitacionFalsa).subscribe({
      next: (puzzles) => {
        const puzzleSotano = puzzles.find(p => p.id === idPuzzlePuertaSotano);
        if (puzzleSotano && puzzleSotano.resuelto) {
          this.viajarHacia('/sotano');
        } else {
          this.viajarHacia('/puerta-sotano');
        }
      }
    });
  }

  alCerrar() {
    this.cerrarMapa.emit();
  }

  // --- NUEVA LÓGICA PARA EL BOSQUE ---
  intentarSalirBosque() {
    this.mostrarPantallaBosque = true;
  }

  volverDePantallaBosque() {
    this.mostrarPantallaBosque = false;
  }

  viajarAlBosque() {
    // Cuando crees el componente del bosque, asegurate de que la ruta coincida acá
    this.viajarHacia('/final-salida-por-la-puerta');
  }
}
