import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from '../services/eventos-globales.service';

@Component({
  selector: 'app-sotano',
  templateUrl: './sotano.component.html',
  styleUrl: './sotano.component.css'
})
export class SotanoComponent implements OnInit {

  hayLuz: boolean = false;

  mostrarMenuInspeccion: boolean = false;
  mostrarMiniMenu: boolean = false;
  mostrarDescripcion: boolean = false;
  mostrarPuzzleModal: boolean = false;

  textoLectura: string = '';
  itemSeleccionado: any = null;
  esPuzzle: boolean = false;

  listaDeObjetosDB: any[] = [];
  listaDePuzzlesDB: any[] = [];
  inventarioUsuario: any[] = [];

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService) { }

  ngOnInit(): void {
    this.verificarLuzYCargarDatos();

    this.apiService.inventarioCambio$.subscribe(() => {
      this.verificarLuzYCargarDatos();
    });
  }

  verificarLuzYCargarDatos() {
    const idHabitacionSotano = 7;
    const idHabitacionFusibles = 1;
    const idUsuarioActual = 1;

    this.apiService.getPuzzles(idHabitacionFusibles).subscribe(puzzles => {
      const cajaFusibles = puzzles.find(p => p.id === 1 || p.Id === 1);
      if (cajaFusibles && (cajaFusibles.resuelto || cajaFusibles.Resuelto)) {
        this.hayLuz = true;
      } else {
        this.hayLuz = false;
      }
    });

    this.apiService.getObjetos(idHabitacionSotano).subscribe(objetos => {
      this.listaDeObjetosDB = objetos;

      this.apiService.getPuzzles(idHabitacionSotano).subscribe(puzzles => {

        // ¡ACÁ ESTÁ LA MAGIA PARA CAMBIAR EL NOMBRE!
        this.listaDePuzzlesDB = puzzles.map(p => {
          if (p.id === 7 || p.Id === 7) {
            p.nombre = "Cerradura";
            p.Nombre = "Cerradura";
          }
          return p;
        });

        const mecanismo = this.listaDePuzzlesDB.find(p => p.id === 7 || p.Id === 7);

        if (mecanismo && (mecanismo.resuelto || mecanismo.Resuelto)) {
          this.listaDePuzzlesDB = this.listaDePuzzlesDB.filter(p => p.id !== 7 && p.Id !== 7);

          const yaTieneEntrar = this.listaDeObjetosDB.find(o => o.EsNavegacion === true);

          if (!yaTieneEntrar) {
            const itemEntrar = {
              id: 999,
              nombre: "Entrar",
              descripcion: "La gran puerta de piedra se ha movido, revelando una entrada a la habitación final.",
              esAgarrable: false,
              EsNavegacion: true
            };
            this.listaDeObjetosDB.push(itemEntrar);
          }
        }
      });
    });

    this.apiService.getInventario(idUsuarioActual).subscribe(datos => this.inventarioUsuario = datos);
  }

  abrirAcciones(item: any, tipo: 'objeto' | 'puzzle') {
    if (item.EsNavegacion) {
      this.navegarFinal();
      return;
    }

    this.itemSeleccionado = item;
    this.esPuzzle = (tipo === 'puzzle');
    this.mostrarMiniMenu = true;
  }

  cerrarMiniMenu() {
    this.mostrarMiniMenu = false;
    this.itemSeleccionado = null;
  }

  alternarInspeccion() {
    this.mostrarMenuInspeccion = !this.mostrarMenuInspeccion;
    if (!this.mostrarMenuInspeccion) this.cerrarMiniMenu();
  }

  verDescripcion() {
    this.textoLectura = this.itemSeleccionado.descripcion || this.itemSeleccionado.Descripcion;
    this.mostrarMiniMenu = false;
    this.mostrarMenuInspeccion = false;
    this.mostrarDescripcion = true;
    if (this.itemSeleccionado.EsAgarrable === false) {
      this.eventosService.sumarAccion();
    }
  }

  cerrarLectura() {
    this.mostrarDescripcion = false;
    this.mostrarMenuInspeccion = true;
    this.mostrarMiniMenu = !!this.itemSeleccionado;
  }

  guardarItem() {
    if (!this.itemSeleccionado) return;

    this.apiService.guardarEnInventario(this.itemSeleccionado.id || this.itemSeleccionado.Id).subscribe({
      next: (res) => {
        this.eventosService.sumarAccion();
        this.inventarioUsuario.push(this.itemSeleccionado);
        this.cerrarMiniMenu();
        this.verificarLuzYCargarDatos();
      },
      error: (err) => {
        if (err.error && err.error.errorType === 'MOCHILA_LLENA') {
          this.eventosService.mostrarAlertaMochila(err.error.mensaje);
          this.cerrarMiniMenu();
        } else {
          console.error("Error al guardar:", err);
        }
      }
    });
  }

  interactuar() {
    this.eventosService.sumarAccion();

    if (!this.itemSeleccionado) return;

    if (this.itemSeleccionado.roto || this.itemSeleccionado.Roto) {
      this.textoLectura = "Las piezas crujen y el mecanismo se traba por completo. Parece que la cerradura se bloqueo";
      this.cerrarMiniMenu();
      this.mostrarMenuInspeccion = false;
      this.mostrarDescripcion = true;
      return;
    }

    if (this.itemSeleccionado.EsNavegacion) {
      this.navegarFinal();
      return;
    }

    this.mostrarMiniMenu = false;
    this.mostrarMenuInspeccion = false;
    this.mostrarPuzzleModal = true;
  }

  manejarPuzzleRoto(mensaje: string) {
    this.mostrarPuzzleModal = false;
    this.itemSeleccionado = null;
    this.verificarLuzYCargarDatos();
  }

  manejarPuzzleResuelto(mensaje: string) {
    this.mostrarPuzzleModal = false;
    this.itemSeleccionado = null;
    this.verificarLuzYCargarDatos();
  }

  navegarFinal() {
    this.eventosService.sumarAccion();
    this.router.navigate(['/el-espiritu-de-la-tormenta']);
  }

  volver() {
    this.eventosService.sumarAccion();
    this.router.navigate(['/pasillo']);
  }
}
