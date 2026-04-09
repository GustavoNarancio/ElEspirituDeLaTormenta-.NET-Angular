import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-puzzle-fusibles',
  templateUrl: './puzzle-fusibles.component.html',
  styleUrls: ['./puzzle-fusibles.component.css']
})
export class PuzzleFusiblesComponent implements OnInit {

  // Agregamos el "megáfono" para avisarle al padre (Lavadero) que nos cierre
  @Output() cerrar = new EventEmitter<void>();

  itemsMochila: any[] = [];
  ranuras: any[] = [null, null, null, null];
  mostrarMiniMenu: boolean = false;
  ranuraActivaIndex: number | null = null;
  mensajeAviso: string | null = null;
  esFinDelPuzzle: boolean = false; // Nos avisa si el puzzle ya se terminó

  constructor(private apiService: ApiService) { }

  ngOnInit() {
    this.cargarInventario();
  }

  cargarInventario() {
    // --- NUEVO: Leemos el ID exacto de tu login ---
    const usuarioStorage = localStorage.getItem('idUsuarioActual');
    const idUsuarioActual = usuarioStorage ? parseInt(usuarioStorage, 10) : 1;

    this.apiService.getInventario(idUsuarioActual).subscribe({
      next: (datos) => {
        this.itemsMochila = datos;
        console.log("Mochila cargada en el puzzle:", this.itemsMochila);
      },
      error: (err) => console.error(err)
    });
  }

  abrirSelectorNumeros(indexRanura: number) {
    this.ranuraActivaIndex = indexRanura;
    this.mostrarMiniMenu = true;
  }

  colocarItem(itemSeleccionado: any) {
    // 1. VERIFICACIÓN: ¿Se llama fusible? (Lo pasamos a minúsculas por las dudas)
    if (!itemSeleccionado.nombre.toLowerCase().includes('fusible')) {
      this.mensajeAviso = "Eso no es un fusible.";
      this.mostrarMiniMenu = false; // Cerramos el menú
      return; // Cortamos la ejecución acá, no lo coloca
    }

    // 2. Si pasó la prueba, lo colocamos en la ranura
    if (this.ranuraActivaIndex !== null) {
      this.ranuras[this.ranuraActivaIndex] = itemSeleccionado;
    }

    // 3. Limpiamos y cerramos
    this.mostrarMiniMenu = false;
    this.ranuraActivaIndex = null;
  }

  darCorriente() {
    const estanTodasLlenas = this.ranuras.every(r => r !== null);
    if (!estanTodasLlenas) {
      this.mensajeAviso = "no deberia intentar dar la corriente si faltan colocar fusibles";
      return; // Acá no es el fin del puzzle, es solo un aviso
    }

    const idsFusibles = this.ranuras.map(r => r.id);
    const idPuzzleActual = 1; // Este 1 es el ID del puzzle, está perfecto así.

    this.apiService.intentarPuzzle(idPuzzleActual, idsFusibles).subscribe({
      next: (respuesta) => {
        this.mensajeAviso = respuesta.mensaje;
        this.esFinDelPuzzle = true; // <--- MARCAMOS EL FINAL
        this.apiService.notificarCambioInventario(); // Avisamos para que recargue
      },
      error: (errorHttp) => {
        this.mensajeAviso = errorHttp.error.mensaje;
        this.esFinDelPuzzle = true; // <--- MARCAMOS EL FINAL
        this.apiService.notificarCambioInventario(); // Avisamos para que recargue
      }
    });
  }

  cerrarPuzzle() {
    this.cerrar.emit();
  }

  // NUEVA FUNCIÓN: Revisa si el ítem ya está puesto en alguna ranura
  itemEstaEnUso(item: any): boolean {
    return this.ranuras.some(ranura => ranura !== null && ranura.id === item.id);
  }

  cerrarAviso() {
    this.mensajeAviso = null;
    this.ranuraActivaIndex = null;

    // Si era el cartel de ganar o perder, cerramos todo el puzzle
    if (this.esFinDelPuzzle) {
      this.cerrarPuzzle();
    }
  }
}
