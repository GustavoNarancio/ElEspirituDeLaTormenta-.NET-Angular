import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-puzzle-camioneta',
  templateUrl: './puzzle-camioneta.component.html',
  styleUrls: ['./puzzle-camioneta.component.css']
})
export class PuzzleCamionetaComponent implements OnInit {

  @Input() inventarioUsuario: any[] = [];
  @Output() resuelto = new EventEmitter<any>();
  @Output() cerrar = new EventEmitter<void>();

  idUsuarioActual: number = 1; // Tu usuario

  // MÁQUINA DE ESTADOS DEL PUZZLE
  // 'intro'        -> Imagen 1: Muestra falla inicial + Mochila abajo.
  // 'errorItem'    -> Imagen 3: Item incorrecto. Sin mochila. Botón Cerrar.png.
  // 'confirmacion' -> Imagen 4: Item correcto (1012, 1013, 1014). Sin mochila. Arreglarlo + Volver.png.
  // 'resultado'    -> Imagen 5 y 6: Resultado de la API. Sin botones abajo, solo [X] CERRAR arriba.
  // 'roto'         -> Puzzle roto de antes.
  estado: 'intro' | 'errorItem' | 'confirmacion' | 'resultado' | 'roto' = 'intro';

  textoCentral: string = 'Revisando vehículo...';
  itemSeleccionado: any = null;
  mostrarMiniMenu: boolean = false;

  // Guardamos los datos que vienen del GET para no perder el texto inicial
  estadoDB: any = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // LLAMADA AL GET: api/puzzles/camioneta/estado/{id}
    this.apiService.getEstadoCamioneta(this.idUsuarioActual).subscribe({
      next: (res) => {
        this.estadoDB = res;

        if (res.resuelto) {
          // Si ya lo había resuelto, disparamos para que desaparezca
          this.resuelto.emit();
        } else if (res.roto) {
          // Si ya lo rompió antes
          this.estado = 'roto';
          this.textoCentral = "Algo se rompió cuando traté de arreglarla. Ahora ya no arranca.";
        } else {
          // Estado normal (Imagen 1)
          this.estado = 'intro';
          this.textoCentral = res.textoInicial;
        }
      },
      error: (err) => {
        console.error("Error API", err);
        this.textoCentral = "No se puede interactuar con el vehículo ahora.";
      }
    });
  }

  abrirMiniMenu(item: any) {
    this.itemSeleccionado = item;
    this.mostrarMiniMenu = true;
  }

  cerrarMiniMenu() {
    this.mostrarMiniMenu = false;
    this.itemSeleccionado = null;
  }

  usarItem() {
    this.mostrarMiniMenu = false;
    const idObj = this.itemSeleccionado.id || this.itemSeleccionado.Id;

    // Evaluamos si el item es uno de los 3 que reparan
    if (idObj === 1012 || idObj === 1013 || idObj === 1014) {
      this.estado = 'confirmacion'; // Pasa a Imagen 4
      this.textoCentral = "Sinceramente no sé nada de autos, no se muy bien lo que estoy haciendo, espero esto sea el arreglo correcto porque puedo llegar a romper la camioneta";
    } else {
      this.estado = 'errorItem'; // Pasa a Imagen 3
      this.textoCentral = "No creo que pueda arreglar el auto con eso...";
    }
  }

  volverAIntro() {
    // Botón Volver o Cerrar (Imágenes 3 y 4)
    this.itemSeleccionado = null;
    this.estado = 'intro';
    this.textoCentral = this.estadoDB.textoInicial; // Recuperamos la falla
  }

  confirmarArreglo() {
    // LLAMADA AL POST: api/puzzles/camioneta/intentar-reparar
    const idObj = this.itemSeleccionado.id || this.itemSeleccionado.Id;

    this.apiService.intentarRepararCamioneta(idObj).subscribe({
      next: (res) => {
        this.estado = 'resultado'; // Pasa a Imagen 5 o 6
        this.textoCentral = res.mensaje; // El mensaje exacto de tu backend

        // Actualizamos estado en memoria
        this.estadoDB.resuelto = res.success;
        this.estadoDB.roto = !res.success;
      },
      error: (err) => {
        console.error(err);
        this.estado = 'resultado';
        this.textoCentral = err.error?.mensaje || "Hubo un error crítico al intentar la reparación.";
        this.estadoDB.roto = true;
      }
    });
  }

  clickCerrarGlobal() {
    // El [ X ] CERRAR de arriba a la derecha
    if (this.estadoDB?.resuelto) {
      this.resuelto.emit(); // Desaparece puzzle, muestra "Subirse"
    } else {
      this.cerrar.emit(); // Solo cierra el modal, vuelve al garaje
    }
  }
}
