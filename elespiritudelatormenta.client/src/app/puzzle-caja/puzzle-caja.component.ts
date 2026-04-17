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
  @Output() resuelto = new EventEmitter<string>();
  @Output() roto = new EventEmitter<string>();

  ranuras: (number | null)[] = [null, null, null, null];
  mostrarMiniMenu: boolean = false;
  ranuraActivaIndex: number | null = null;
  mensajeAviso: string | null = null; // Para el aviso chiquito ("Necesito completar...")

  // ---> NUEVAS VARIABLES: Control del cartel gigante de historia
  intentosFallidos: number = 0;
  mostrarAdvertencia: boolean = false;
  textoAdvertencia: string = '';

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
      this.mensajeAviso = "Necesito completar los 4 dígitos para probar abrirla.";
      return;
    }
    if (!this.puzzleId) return;

    // PRUEBA 1: Vemos con qué valor arranca el click
    console.log("1. Click Probar. intentosFallidos vale:", this.intentosFallidos);

    const digitos = this.ranuras as number[];
    const esElUltimo = this.intentosFallidos === 1;

    // PRUEBA 2: Vemos qué va a mandar a .NET
    console.log("2. Se envía esUltimoIntento como:", esElUltimo);

    this.apiService.intentarCaja(this.puzzleId, digitos, esElUltimo).subscribe({
      next: (respuesta) => {
        this.resuelto.emit(respuesta.mensaje);
      },
      error: (errorHttp) => {
        this.intentosFallidos++;

        // PRUEBA 3: Vemos si logró sumar
        console.log("3. Entró al error. intentosFallidos AHORA vale:", this.intentosFallidos);

        if (this.intentosFallidos === 1) {
          this.textoAdvertencia = "Esa no era la combinación correcta. Al tratar de forzarla me doy cuenta de que es una caja muy antigua y los engranajes están gastados, no creo que aguante otra combinación incorrecta antes de trabarse por completo.";          this.mostrarAdvertencia = true;
        } else {
          const msj = errorHttp.error?.mensaje || "Puse la combinación incorrecta y la perilla quedó completamente trabada.";
          this.roto.emit(msj);
        }
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

  // ---> NUEVA FUNCIÓN: Cierra el cartel gigante y resetea los números
  cerrarAdvertencia() {
    this.mostrarAdvertencia = false;
    this.ranuras = [null, null, null, null]; // Limpiamos para que intente de nuevo
  }
}
