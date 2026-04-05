import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-puzzle-caja',
  templateUrl: './puzzle-caja.component.html',
  styleUrls: ['./puzzle-caja.component.css']
})
export class PuzzleCajaComponent implements OnInit {

  @Input() puzzleId: number | undefined;
  @Output() cerrar = new EventEmitter<void>();
  @Output() resuelto = new EventEmitter<string>(); // <--- Agregamos <string>
  @Output() roto = new EventEmitter<string>();

  ranuras: (number | null)[] = [null, null, null, null];
  mostrarMiniMenu: boolean = false;
  ranuraActivaIndex: number | null = null;
  mensajeAviso: string | null = null;

  numerosDisponibles: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor(private apiService: ApiService) { }

  ngOnInit() { }

  abrirSelectorNumeros(indexRanura: number) {
    this.ranuraActivaIndex = indexRanura;
    this.mostrarMiniMenu = true;
  }

  colocarNumero(numeroSeleccionado: number) {
    if (this.ranuraActivaIndex !== null) {
      this.ranuras[this.ranuraActivaIndex] = numeroSeleccionado;
    }
    this.mostrarMiniMenu = false;
    this.ranuraActivaIndex = null;
  }

  probarCombinacion() {
    const estanTodasLlenas = this.ranuras.every(r => r !== null);
    if (!estanTodasLlenas) {
      this.mensajeAviso = "Necesito completar los 4 digitos para probar abrirla";
      return;
    }

    console.log("--> INICIANDO INTENTO DE ABRIR CAJA");
    console.log("1. ID del Puzzle detectado:", this.puzzleId);
    console.log("2. Combinación armada:", this.ranuras);

    // Si el ID sigue siendo undefined, gritamos el error en la consola
    if (!this.puzzleId) {
      console.error("¡ERROR CRÍTICO! Angular no sabe cuál es el ID del puzzle. El envío a .NET se abortó.");
      return;
    }

    const digitos = this.ranuras as number[];
    console.log("3. Viajando al Backend...");

    // Viajamos a .NET
    this.apiService.intentarCaja(this.puzzleId, digitos).subscribe({
      next: (respuesta) => {
        console.log("4. ¡Éxito! .NET respondió:", respuesta);
        this.resuelto.emit(respuesta.mensaje); // <--- Le pasamos el texto acá
      },
      error: (errorHttp) => {
        console.error("4. Error o Fallo en .NET:", errorHttp);
        const msj = errorHttp.error?.mensaje || "puse la combinacion incorrecta y ahora la caja se trabó";
        this.roto.emit(msj);
      }
    });
  }

  cerrarPuzzle() {
    this.cerrar.emit();
  }

  cerrarAviso() {
    this.mensajeAviso = null;
    this.ranuraActivaIndex = null;
  }
}
