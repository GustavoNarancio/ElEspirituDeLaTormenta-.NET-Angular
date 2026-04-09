import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from '../services/eventos-globales.service'; 

@Component({
  selector: 'app-garaje',
  templateUrl: './garaje.component.html',
  styleUrls: ['./garaje.component.css']
})
export class GarajeComponent implements OnInit {

  idHabitacion: number = 6; 
  idUsuario: number = 1;    // ID del usuario jugando

  // Variables de control de UI
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

  // --- VARIABLE DE ESTADO FINAL ---
  escenaFinal: number = 0;

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService
) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Cargamos Objetos normales
    this.apiService.getObjetos(this.idHabitacion).subscribe(objetos => {
      // Limpiamos por las dudas si "camioneta" había quedado guardada como objeto normal antes
      this.listaDeObjetosDB = objetos.filter(o => o.nombre?.toLowerCase() !== 'camioneta');

      // 2. Cargamos Puzzles normales
      this.apiService.getPuzzles(this.idHabitacion).subscribe(puzzles => {
        // Filtramos los normales que ya estén resueltos
        this.listaDePuzzlesDB = puzzles.filter(p => !(p.resuelto || p.Resuelto) && p.nombre?.toLowerCase() !== 'camioneta');

        // 3. LA VERDAD ABSOLUTA: Consultamos la tabla ÚNICA de la Camioneta
        this.apiService.getEstadoCamioneta(this.idUsuario).subscribe(estadoCamioneta => {

          if (estadoCamioneta.resuelto || estadoCamioneta.Resuelto) {

            // Si está resuelta, creamos el ítem para escapar
            const itemSubir = {
              id: 999,
              nombre: "Subirse a la camioneta",
              descripcion: "La camioneta está en marcha y lista para escapar.",
              esAgarrable: false,
              EsNavegacion: true // Detona el escape
            };
            this.listaDeObjetosDB.push(itemSubir);

          } else {

            // Si NO está resuelta (o está rota), creamos el puzzle para interactuar
            const puzzleCamioneta = {
              id: 888,
              nombre: "Camioneta",
              descripcion: "La camioneta del comisario. Está un poco vieja y descuidada, pero parece que es capaz de andar por donde sea",
              EsPuzzleEspecial: true // Detona el modal
            };
            this.listaDePuzzlesDB.push(puzzleCamioneta);

          }
        });
      });
    });

    // 4. Cargamos Inventario para el Garaje
    this.apiService.getInventario(this.idUsuario).subscribe(datos => {
      this.inventarioUsuario = datos;
    });
  }

  abrirAcciones(item: any, tipo: 'objeto' | 'puzzle') {
    this.itemSeleccionado = item;
    // Lo marcamos como puzzle si es genérico o si es nuestro puzzle especial virtual
    this.esPuzzle = (tipo === 'puzzle' || item.EsPuzzleEspecial);
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
    this.mostrarMenuInspeccion = true; // ¡Esto es lo que hace que vuelva el panel de abajo!
  }
  guardarItem() {
    if (!this.itemSeleccionado) return;

    this.apiService.guardarEnInventario(this.itemSeleccionado.id || this.itemSeleccionado.Id).subscribe({
      next: (res) => {
        // Éxito: lógica local + notificaciones globales
        this.inventarioUsuario.push(this.itemSeleccionado);
        this.cerrarMiniMenu();
        this.cargarDatos();

        // Avisamos a la app que hay un item nuevo y sumamos la acción
        this.apiService.notificarCambioInventario();
        this.eventosService.sumarAccion();
      },
      error: (err) => {
        // Manejo del error: si la mochila está llena, mostramos tu alerta
        if (err.error && err.error.errorType === 'MOCHILA_LLENA') {
          this.eventosService.mostrarAlertaMochila(err.error.mensaje);
          this.cerrarMiniMenu(); // Cerramos el menú para dejar ver el cartel
        } else {
          console.error("Error al guardar:", err);
        }
      }
    });
  }

  interactuar() {
    this.eventosService.sumarAccion();

    if (!this.itemSeleccionado) return;

    // 1. Si el usuario seleccionó "Subirse a la camioneta"
    if (this.itemSeleccionado.EsNavegacion) {
      this.cerrarMiniMenu();
      this.mostrarMenuInspeccion = false;
      this.escenaFinal = 1;
      return;
    }

    // 2. Si seleccionó el puzzle "Camioneta" (abrimos el modal)
    if (this.itemSeleccionado.EsPuzzleEspecial) {
      this.cerrarMiniMenu();
      this.mostrarMenuInspeccion = false;
      this.mostrarPuzzleModal = true;
      return;
    }

    // 3. Flujo normal para otros puzzles de la habitación
    this.cerrarMiniMenu();
    this.mostrarMenuInspeccion = false;
    // ... acá iría la lógica si tuvieras otros modales
  }

  manejarPuzzleResuelto(mensaje: any) {
    this.mostrarPuzzleModal = false;
    this.itemSeleccionado = null;
    // Al recargar, detectará que EstadoCamioneta.Resuelto es true y mostrará "Subirse"
    this.cargarDatos();
  }

  manejarPuzzleCerrado() {
    this.mostrarPuzzleModal = false;
    this.mostrarMenuInspeccion = true;
  }

  volverAtras() {
    this.eventosService.sumarAccion();

    this.router.navigate(['/pasillo'], { replaceUrl: true });
  }

  escaparConCamioneta() {
    this.router.navigate(['/escapeFinal'], { replaceUrl: true });
  }

  volverDePantallaNegra() {
    this.escenaFinal = 0;
  }
}
