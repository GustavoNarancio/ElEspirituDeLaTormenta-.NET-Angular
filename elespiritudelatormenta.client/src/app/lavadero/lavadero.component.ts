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
  mostrarMenuInspeccion: boolean = false; // El marco largo de abajo
  mostrarMiniMenu: boolean = false;       // El cuadro cuadrado de acciones
  mostrarDescripcion: boolean = false;       // El cartel con la descripción del ítem
  mostrarPuzzleModal: boolean = false;
  textoLectura: string = '';


  // 2. Datos de la DB
  listaDeObjetosDB: any[] = [];
  listaDePuzzlesDB: any[] = [];

  // 3. Ítem que el usuario clickeó (puede ser Objeto o Puzzle)
  itemSeleccionado: any = null;
  esPuzzle: boolean = false;

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService) { }

  ngOnInit(): void {
    this.cargarDatosDelLavadero();

    // EL LAVADERO PRENDE LA RADIO Y ESCUCHA:
    this.apiService.inventarioCambio$.subscribe(() => {
      this.cargarDatosDelLavadero();
    });
  }

  cargarDatosDelLavadero() {
    const idHabitacion = 1;
    this.apiService.getObjetos(idHabitacion).subscribe(datos => this.listaDeObjetosDB = datos);
    this.apiService.getPuzzles(idHabitacion).subscribe(datos => this.listaDePuzzlesDB = datos);
  }

  // --- LÓGICA DE INTERACCIÓN ---

  // Esta función centraliza todo el click de la lista
  abrirAcciones(item: any, tipo: 'objeto' | 'puzzle') {
    this.itemSeleccionado = item;
    this.esPuzzle = (tipo === 'puzzle');
    this.mostrarMiniMenu = true;

    // Debug para ver qué llega de la DB
    console.log("Datos del item:", item);
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
    this.router.navigate(['/juego']);
  }

  // Esta función la llamaremos desde el botón "Ver Descripción" del cuadrito
  verDescripcion() {
    this.textoLectura = this.itemSeleccionado.descripcion; // Acá cargamos la BD
    this.mostrarMiniMenu = false;
    this.mostrarMenuInspeccion = false;
    this.mostrarDescripcion = true;
    if (this.itemSeleccionado.EsAgarrable === false) {
      this.eventosService.sumarAccion();            }

  }

  cerrarLectura() {
    this.mostrarDescripcion = false;
    this.mostrarMenuInspeccion = true;  // Vuelve el marco largo
    this.mostrarMiniMenu = true;        // Vuelve el cuadrito de opciones
  }
  guardarItem() {
    if (!this.itemSeleccionado) return;

    this.apiService.guardarEnInventario(this.itemSeleccionado.id).subscribe({
      next: (res) => {
        // Éxito: lo de siempre
        this.cerrarMiniMenu();
        this.cargarDatosDelLavadero();
        this.apiService.notificarCambioInventario();
        this.eventosService.sumarAccion();
      },
      error: (err) => {
        // ACÁ ESTÁ EL CAMBIO:
        if (err.error && err.error.errorType === 'MOCHILA_LLENA') {
          this.eventosService.mostrarAlertaMochila(err.error.mensaje);
          this.cerrarMiniMenu(); // Cerramos el menú para que el usuario vea el cartel
        } else {
          console.error("Error al guardar:", err);
        }
      }
    });
  }

  // Esta función la llamaremos desde el botón "Interactuar" del cuadrito
  interactuar() {
    if (!this.itemSeleccionado) return;
    this.eventosService.sumarAccion();
    // A. ¿Está resuelto bien?
    if (this.itemSeleccionado.resuelto) {
      // Texto exacto que pediste:
      this.textoLectura = "la corriente fluye por toda la casa, la caja de fusibles se ve bien";
      this.mostrarMiniMenu = false;
      this.mostrarMenuInspeccion = false;
      this.mostrarDescripcion = true;
      return; // Corta acá
    }

    // B. ¿Está roto?
    if (this.itemSeleccionado.roto) {
      // Texto exacto que pediste:
      this.textoLectura = "la caja de fusibles está quemada, no hay forma de arreglarla";
      this.mostrarMiniMenu = false;
      this.mostrarMenuInspeccion = false;
      this.mostrarDescripcion = true;
      return; // Corta acá
    }

    // C. Si no está ni resuelto ni roto, ABRE EL PUZZLE
    console.log("Abriendo puzzle:", this.itemSeleccionado.nombre);
    this.cerrarMiniMenu();
    this.mostrarMenuInspeccion = false;
    this.mostrarPuzzleModal = true;
  }

}
