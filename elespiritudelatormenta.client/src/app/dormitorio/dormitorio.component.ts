import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from '../services/eventos-globales.service';

@Component({
  selector: 'app-dormitorio',
  templateUrl: './dormitorio.component.html',
  styleUrls: ['./dormitorio.component.css']
})
export class DormitorioComponent implements OnInit {

  mostrarMenuInspeccion: boolean = false;
  mostrarMiniMenu: boolean = false;
  mostrarDescripcion: boolean = false;
  mostrarPuzzleModal: boolean = false;
  mostrarInteriorCaja: boolean = false;

  textoLectura: string = '';
  itemSeleccionado: any = null;
  esPuzzle: boolean = false;
  llaveSecreta: any = null;

  listaDeObjetosDB: any[] = [];
  listaDePuzzlesDB: any[] = [];
  inventarioUsuario: any[] = []; // Lo que realmente tenés en la mochila

  // --- NUEVA VARIABLE DE ESTADO (Fix para el flujo de éxito) ---
  esperandoVerInteriorCaja: boolean = false;

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService) { }

  ngOnInit(): void {
    this.cargarDatosDelDormitorio();
    this.apiService.inventarioCambio$.subscribe(() => {
      this.cargarDatosDelDormitorio();
    });
  }

  cargarDatosDelDormitorio() {
    const idHabitacion = 4;

    // --- LEYENDO EL ID EXACTO DE TU LOGIN ---
    const usuarioStorage = localStorage.getItem('idUsuarioActual');
    const idUsuarioActual = usuarioStorage ? parseInt(usuarioStorage, 10) : 1;

    this.apiService.getObjetos(idHabitacion).subscribe(datos => this.listaDeObjetosDB = datos);
    this.apiService.getPuzzles(idHabitacion).subscribe(datos => this.listaDePuzzlesDB = datos);
    this.apiService.getInventario(idUsuarioActual).subscribe(datos => this.inventarioUsuario = datos);
  }

  elUsuarioTieneLaLlave(): boolean {
    // Validamos contra la mochila real de la base de datos (ID 19)
    return this.inventarioUsuario.some(item => item.id === 19);
  }

  abrirAcciones(item: any, tipo: 'objeto' | 'puzzle') {
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
    this.textoLectura = this.itemSeleccionado.descripcion;
    this.mostrarMiniMenu = false;
    this.mostrarMenuInspeccion = false;
    this.mostrarDescripcion = true;
    if (this.itemSeleccionado.EsAgarrable === false) {
      this.eventosService.sumarAccion();
    }
  }

  // --- FIX FLUJO ÉXITO (Paso 1): Modificada función general ---
  cerrarLectura() {
    this.mostrarDescripcion = false;

    if (this.esperandoVerInteriorCaja) {
      // Si estábamos esperando ver el interior tras el éxito (Imagen 1 -> Imagen Especial)
      this.mostrarInteriorCaja = true;
      this.mostrarMenuInspeccion = false;
      this.mostrarMiniMenu = false; // Nos aseguramos de limpiar el minimenú
      this.itemSeleccionado = null; // Limpiamos selección
      this.esperandoVerInteriorCaja = false; // Reseteamos flag
    } else {
      // Flujo normal de cerrar descripción de objeto
      this.mostrarMenuInspeccion = true;
      this.mostrarMiniMenu = !!this.itemSeleccionado;
    }
  }

  guardarItem() {
    if (!this.itemSeleccionado) return;

    this.apiService.guardarEnInventario(this.itemSeleccionado.id).subscribe({
      next: (res) => {
        // OPTIMISTIC UPDATE: Actualizamos localmente al instante para que desaparezca la llave
        this.inventarioUsuario.push(this.itemSeleccionado);
        this.eventosService.sumarAccion();

        this.cerrarMiniMenu();
        // Cierra el interior de la caja si justo agarraste la llave ID 19
        if (this.mostrarInteriorCaja && this.itemSeleccionado.id === 19) {
          this.mostrarInteriorCaja = false;
          this.mostrarMenuInspeccion = true;
        }
        this.cargarDatosDelDormitorio();
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

    if (this.itemSeleccionado.roto) {
      this.textoLectura = "puse la combinacion incorrecta y ahora la caja se trabó";
      this.cerrarMiniMenu(); // Limpiamos selección al mostrar cartel
      this.mostrarMenuInspeccion = false;
      this.mostrarDescripcion = true;
      return;
    }

    if (this.itemSeleccionado.resuelto) {
      this.llaveSecreta = {
        id: 19, // ID real de la llave
        nombre: "Llave",
        descripcion: "Una llave antigua y robusta. Seguramente abre algo importante.",
        esAgarrable: true,
        esInteractuableEspecial: false
      };
      this.mostrarMiniMenu = false;
      this.mostrarMenuInspeccion = false;
      this.mostrarInteriorCaja = true;
      return;
    }

    this.mostrarMiniMenu = false;
    this.mostrarMenuInspeccion = false;
    this.mostrarPuzzleModal = true;
  }

  manejarPuzzleRoto(mensaje: string) {
    this.mostrarPuzzleModal = false;
    this.textoLectura = mensaje;
    // El puzzle se terminó (mal), ya no hay item seleccionado
    this.itemSeleccionado = null;
    this.mostrarMiniMenu = false;
    this.mostrarDescripcion = true;
    this.cargarDatosDelDormitorio();
  }

  // --- FIX FLUJO ÉXITO (Paso 2): Activamos estado intermedio ---
  manejarPuzzleResuelto(mensaje: string) {
    this.mostrarPuzzleModal = false;

    if (this.itemSeleccionado) this.itemSeleccionado.resuelto = true;
    this.mostrarMiniMenu = false; // Cerramos el menú de acciones

    // Preparamos el item de la llave internamente
    this.llaveSecreta = {
      id: 19, // ID real de la llave
      nombre: "Llave",
      descripcion: "Una llave antigua y robusta. Seguramente abre algo importante.",
      esAgarrable: true,
      esInteractuableEspecial: false
    };

    this.textoLectura = mensaje;
    this.mostrarDescripcion = true; // Mostramos el cartel de "¡Éxito!" (Imagen 1)

    // ACTIVAMOS EL FLAG: Queremos saltar al interior al cerrar este cartel
    this.esperandoVerInteriorCaja = true;

    this.cargarDatosDelDormitorio();
  }

  cerrarInteriorCaja() {
    this.mostrarInteriorCaja = false;
    this.mostrarMenuInspeccion = true;
    this.cerrarMiniMenu(); // Evita que quede el minimenú flotando
  }

  volver() {
    this.eventosService.sumarAccion();
    this.router.navigate(['/pasillo'], { replaceUrl: true });
  }
}
