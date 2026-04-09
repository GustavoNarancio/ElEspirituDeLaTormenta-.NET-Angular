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

  idUsuarioActual: number = 1; // Fallback

  // MÁQUINA DE ESTADOS DEL PUZZLE
  estado: 'intro' | 'errorItem' | 'confirmacion' | 'resultado' | 'roto' = 'intro';

  textoCentral: string = 'Revisando vehículo...';
  itemSeleccionado: any = null;
  mostrarMiniMenu: boolean = false;

  estadoDB: any = null;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    // --- NUEVO: Leemos el ID exacto de tu login ---
    const usuarioStorage = localStorage.getItem('idUsuarioActual');
    this.idUsuarioActual = usuarioStorage ? parseInt(usuarioStorage, 10) : 1;

    // LLAMADA AL GET: api/puzzles/camioneta/estado/{id}
    this.apiService.getEstadoCamioneta(this.idUsuarioActual).subscribe({
      next: (res) => {
        this.estadoDB = res;

        if (res.resuelto) {
          this.resuelto.emit();
        } else if (res.roto) {
          this.estado = 'roto';
          this.textoCentral = "Algo se rompió cuando traté de arreglarla. Ahora ya no arranca.";
        } else {
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

    if (idObj === 1012 || idObj === 1013 || idObj === 1014) {
      this.estado = 'confirmacion';
      this.textoCentral = "Sinceramente no sé nada de autos, no se muy bien lo que estoy haciendo, espero esto sea el arreglo correcto porque puedo llegar a romper la camioneta";
    } else {
      this.estado = 'errorItem';
      this.textoCentral = "No creo que pueda arreglar el auto con eso...";
    }
  }

  volverAIntro() {
    this.itemSeleccionado = null;
    this.estado = 'intro';
    this.textoCentral = this.estadoDB.textoInicial;
  }

  confirmarArreglo() {
    const idObj = this.itemSeleccionado.id || this.itemSeleccionado.Id;

    this.apiService.intentarRepararCamioneta(idObj).subscribe({
      next: (res) => {
        this.estado = 'resultado';
        this.textoCentral = res.mensaje;

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
    if (this.estadoDB?.resuelto) {
      this.resuelto.emit();
    } else {
      this.cerrar.emit();
    }
  }
}
