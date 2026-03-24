import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

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


  // 2. Datos de la DB
  listaDeObjetosDB: any[] = [];
  listaDePuzzlesDB: any[] = [];

  // 3. Ítem que el usuario clickeó (puede ser Objeto o Puzzle)
  itemSeleccionado: any = null;
  esPuzzle: boolean = false;

  constructor(private router: Router, private apiService: ApiService) { }

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

  alternarInspeccion() {
    this.mostrarMenuInspeccion = !this.mostrarMenuInspeccion;
    if (!this.mostrarMenuInspeccion) {
      this.cerrarMiniMenu();
    }
  }

  volver() {
    this.router.navigate(['/juego']);
  }

  // Esta función la llamaremos desde el botón "Ver Descripción" del cuadrito
  verDescripcion() {
    this.mostrarMiniMenu = false;       // Esconde el cuadrito de opciones
    this.mostrarMenuInspeccion = false; // Esconde el marco largo de abajo
    this.mostrarDescripcion = true;         // Muestra el marco de descripción central
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
        console.log("Hacha guardada!");
        this.cerrarMiniMenu();
        // Actualizamos la lista para que el hacha desaparezca del lavadero
        this.cargarDatosDelLavadero();
      },
      error: (err) => console.error("Error al guardar:", err)
    });
  }


}
