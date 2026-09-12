import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from '../services/api.service'; // Ajustá la ruta de tu servicio

@Component({
  selector: 'app-puzzle-sotano',
  templateUrl: './puzzle-sotano.component.html',
  styleUrls: ['./puzzle-sotano.component.css']
})
export class PuzzleSotanoComponent {

  // ---> LA ÚNICA MODIFICACIÓN: Le puse 'any' para que Vercel no rompa
  @Input() puzzleId: any;

  @Output() cerrar = new EventEmitter<void>();
  @Output() resuelto = new EventEmitter<string>();
  @Output() roto = new EventEmitter<string>();

  // Estados: 0 = Intro, 1 = Puzzle UI, 2 = Mensaje Final
  estadoPantalla: number = 0;
  mensajeFinal: string = "";

  // Datos de las piezas
  piezasDisponibles = [
    { nombre: 'Lucas', img: '/assets/Lucas.png' },
    { nombre: 'Carla', img: '/assets/Carla.png' },
    { nombre: 'Nico', img: '/assets/Nico.png' },
    { nombre: 'Matias', img: '/assets/Matias.png' }
  ];

  // Las 4 ranuras (null significa vacía)
  ranuras: any[] = [null, null, null, null];

  mostrarMiniMenuNombres: boolean = false;
  ranuraSeleccionadaIndex: number = -1;

  constructor(private apiService: ApiService) { }

  comenzarPuzzle() {
    this.estadoPantalla = 1;
  }

  abrirOpcionesRanura(index: number) {
    // Si ya hay una pieza en la ranura, la devolvemos a disponibles
    if (this.ranuras[index] != null) {
      this.piezasDisponibles.push(this.ranuras[index]);
      this.ranuras[index] = null;
    }
    this.ranuraSeleccionadaIndex = index;
    this.mostrarMiniMenuNombres = true;
  }

  seleccionarPieza(pieza: any) {
    // Ponemos la pieza en la ranura
    this.ranuras[this.ranuraSeleccionadaIndex] = pieza;
    // La sacamos de la lista de disponibles
    this.piezasDisponibles = this.piezasDisponibles.filter(p => p.nombre !== pieza.nombre);
    this.mostrarMiniMenuNombres = false;

    // ELIMINAMOS el código que llamaba a enviarCombinacionAlBackend() automáticamente
  }

  // --- NUEVAS FUNCIONES PARA EL BOTÓN ---

  estanTodasLlenas(): boolean {
    // Devuelve true solo si no hay ningún null en el arreglo
    return this.ranuras.every(r => r !== null);
  }

  probarCombinacion() {
    if (this.estanTodasLlenas()) {
      this.enviarCombinacionAlBackend();
    }
  }

  cerrarMiniMenu() {
    this.mostrarMiniMenuNombres = false;
  }

  enviarCombinacionAlBackend() {
    const nombresSeleccionados = this.ranuras.map(r => r.nombre);

    // Llamada al endpoint que creamos en el Paso 1
    // (Asegurate de tener este método postIntentoSotano en tu apiService)
    this.apiService.postIntentoSotano(this.puzzleId, nombresSeleccionados).subscribe({
      next: (res: any) => {
        this.mensajeFinal = res.mensaje;
        this.estadoPantalla = 2; // Éxito (Imagen 4)
      },
      error: (err: any) => {
        this.mensajeFinal = err.error.mensaje || "El mecanismo se rompió.";
        this.estadoPantalla = 3; // Roto
      }
    });
  }

  continuarFinal() {
    if (this.estadoPantalla === 2) {
      this.resuelto.emit(this.mensajeFinal);
    } else {
      this.roto.emit(this.mensajeFinal);
    }
  }

  cancelar() {
    this.cerrar.emit();
  }
}
