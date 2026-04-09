import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from '../services/eventos-globales.service';

@Component({
  selector: 'app-lavadero',
  templateUrl: './lavadero.component.html',
  styleUrls: ['./lavadero.component.css']
})
export class LavaderoComponent implements OnInit {

  // 1. Controles de Visibilidad
  mostrarMenuInspeccion: boolean = false;
  mostrarMiniMenu: boolean = false;
  mostrarDescripcion: boolean = false;
  mostrarPuzzleModal: boolean = false;
  textoLectura: string = '';

  // --- NUEVAS VARIABLES PARA LA NOTA ---
  mostrarNotaEspecial: boolean = false;
  paginaActualIndex: number = 0;
  paginasNota: string[] = [
    "Una hoja suelta, escrita con apuro. Reconozco la letra de inmediato, es de mi abuelo Thaddeus:\n\n“Al margen de la tablilla, encontré este cántico. Relata el orden perfecto de algún ritual:”",
    "La llama dorada que devora la pradera.\nLa rama desnuda que se rinde a la brisa.\nLa cuna de escarcha donde la bestia sueña.\nLa lágrima del deshielo que despierta la raíz."
  ];

  // 2. Datos de la DB
  listaDeObjetosDB: any[] = [];
  listaDePuzzlesDB: any[] = [];

  // 3. Ítem que el usuario clickeó
  itemSeleccionado: any = null;
  esPuzzle: boolean = false;

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService) { }

  ngOnInit(): void {
    this.cargarDatosDelLavadero();

    this.apiService.inventarioCambio$.subscribe(() => {
      this.cargarDatosDelLavadero();
    });
  }

  cargarDatosDelLavadero() {
    const idHabitacion = 1;
    this.apiService.getObjetos(idHabitacion).subscribe(datos => this.listaDeObjetosDB = datos);
    this.apiService.getPuzzles(idHabitacion).subscribe(datos => this.listaDePuzzlesDB = datos);
  }

  // --- LÓGICA DE INTERACCIÓN MODIFICADA ---
  abrirAcciones(item: any, tipo: 'objeto' | 'puzzle' | 'especial') {
    this.itemSeleccionado = item;

    // Evaluamos si es la nota fija o algo de la DB
    if (tipo === 'especial') {
      this.esPuzzle = false;
      item.esInteractuableEspecial = true;
    } else {
      this.esPuzzle = (tipo === 'puzzle');
      if (this.itemSeleccionado) this.itemSeleccionado.esInteractuableEspecial = false;
    }

    this.mostrarMiniMenu = true;
  }

  cerrarMiniMenu() {
    this.mostrarMiniMenu = false;
    this.itemSeleccionado = null;
  }

  cerrarPuzzle() {
    this.mostrarPuzzleModal = false;
  }

  alternarInspeccion() {
    this.mostrarMenuInspeccion = !this.mostrarMenuInspeccion;
    if (!this.mostrarMenuInspeccion) {
      this.cerrarMiniMenu();
    }
  }

  volver() {
    this.eventosService.sumarAccion();
    this.router.navigate(['/juego'], { replaceUrl: true });
  }

  // --- LÓGICA DE LA NOTA PAGINADA ---
  abrirNotaEspecial() {
    this.eventosService.sumarAccion();
    this.mostrarNotaEspecial = true;
    this.mostrarMenuInspeccion = false;
    this.cerrarMiniMenu();
    this.paginaActualIndex = 0; // Arranca en la pág 1
  }

  cerrarNotaEspecial() {
    this.mostrarNotaEspecial = false;
    this.mostrarMenuInspeccion = true; // Volvemos al menú
  }

  paginaSiguiente() {
    if (this.paginaActualIndex < this.paginasNota.length - 1) {
      this.paginaActualIndex++;
    }
  }

  paginaAnterior() {
    if (this.paginaActualIndex > 0) {
      this.paginaActualIndex--;
    }
  }

  // --- RESTO DEL CÓDIGO ORIGINAL ---
  verDescripcion() {
    this.textoLectura = this.itemSeleccionado.descripcion;
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
    this.mostrarMiniMenu = true;
  }

  guardarItem() {
    if (!this.itemSeleccionado) return;
    this.apiService.guardarEnInventario(this.itemSeleccionado.id).subscribe({
      next: (res) => {
        this.cerrarMiniMenu();
        this.cargarDatosDelLavadero();
        this.apiService.notificarCambioInventario();
        this.eventosService.sumarAccion();
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
    if (!this.itemSeleccionado) return;
    this.eventosService.sumarAccion();
    if (this.itemSeleccionado.resuelto) {
      this.textoLectura = "la corriente fluye por toda la casa, la caja de fusibles se ve bien";
      this.mostrarMiniMenu = false;
      this.mostrarMenuInspeccion = false;
      this.mostrarDescripcion = true;
      return;
    }
    if (this.itemSeleccionado.roto) {
      this.textoLectura = "la caja de fusibles está quemada, no hay forma de arreglarla";
      this.mostrarMiniMenu = false;
      this.mostrarMenuInspeccion = false;
      this.mostrarDescripcion = true;
      return;
    }
    console.log("Abriendo puzzle:", this.itemSeleccionado.nombre);
    this.cerrarMiniMenu();
    this.mostrarMenuInspeccion = false;
    this.mostrarPuzzleModal = true;
  }
}
