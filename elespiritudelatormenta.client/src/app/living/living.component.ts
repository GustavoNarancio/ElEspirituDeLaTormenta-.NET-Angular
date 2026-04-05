import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from '../services/eventos-globales.service'; 
interface Documento {
  id: number;
  tituloBoton: string;
  texto: string;
}

@Component({
  selector: 'app-living',
  templateUrl: './living.component.html',
  styleUrls: ['./living.component.css']
})
export class LivingComponent implements OnInit {

  mostrarMenuInspeccion: boolean = false;
  mostrarMiniMenu: boolean = false;
  mostrarDescripcion: boolean = false;
  mostrarPuzzleModal: boolean = false;
  textoLectura: string = '';
  itemSeleccionado: any = null;
  esPuzzle: boolean = false;

  listaDeObjetosDB: any[] = [];
  listaDePuzzlesDB: any[] = [];

  // Variables del Escritorio
  mostrarEscritorioInterface: boolean = false;
  documentosDisponibles: Documento[] = [];
  documentoActual: Documento | null = null;

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService
 ) { }

  ngOnInit(): void {
    this.cargarDatosDelLiving();
    this.cargarTextosEscritorio(); // Cargamos los papeles hardcodeados

    this.apiService.inventarioCambio$.subscribe(() => {
      this.cargarDatosDelLiving();
    });
  }

  cargarDatosDelLiving() {
    const idHabitacion = 3;

    this.apiService.getObjetos(idHabitacion).subscribe({
      next: (datos) => this.listaDeObjetosDB = datos,
      error: (err) => console.error("Error cargando objetos", err)
    });

    this.apiService.getPuzzles(idHabitacion).subscribe({
      next: (datos) => this.listaDePuzzlesDB = datos,
      error: (err) => console.error("Error cargando puzzles", err)
    });
  }

  cargarTextosEscritorio() {
    this.documentosDisponibles = [
      {
        id: 1,
        tituloBoton: 'Papel 1',
        texto: "Una hoja de papel arrugada y ligeramente amarillenta, con una lista de compras escrita a mano.\n\nSe pueden leer elementos como:\nLeche, Pan, Huevos y Café.\n\nLa letra es apresurada pero clara, y hay pequeñas marcas de verificación junto a algunos de los artículos, indicando que ya han sido comprados."
      },
      {
        id: 2,
        tituloBoton: 'Nota 1',
        texto: "Un pequeño trozo de papel colorido con una cita motivacional escrita en negrita:\n\n“La vida es un 10% lo que te ocurre y un 90% cómo reaccionas a ello.”\n\nEsta nota está pegada con cinta adhesiva en la esquina del escritorio, como si fuera una fuente constante de inspiración y recordatorio diario."
      },
      {
        id: 3,
        tituloBoton: 'Nota 2',
        texto: "Una nota de papel cuidadosamente doblada con el título:\n\n“No olvidar combinación de fusibles 01/02/14  ”\n\nAl desdoblarla se revela una lista de colores:\n\nVerde– Rojo – Azul – Marron"
      },
      {
        id: 4,
        tituloBoton: 'Nota 3',
        texto: "Una tarjeta de visita de un taller mecánico local.\n\nEn el reverso hay una anotación rápida:\n“Traer a las 15:00 ”\n\nLa tarjeta se ve nueva. Parece que es de ayer."
      },
      {
        id: 5,
        tituloBoton: 'Nota 4',
        texto: "Se rompió la caja de fusibles de nuevo, tuvo que venir el electricista, estaban mal colocados los fusibles. Me dijo que tienen que quedar:\n\nMarron – Verde – Rojo – Azul  no encontramos los fusibles, no se donde los dejaste, pero que queden como te puse.02/02/14 "
        
      },
      {
        id: 6,
        tituloBoton: 'Papel 2',
        texto: "Entregarle los papeles al jefe para que deje de molestarme sobre la desaparición de Thaddeus Tolder"
        
      }

    ];
  }

  abrirAcciones(item: any, tipo: 'objeto' | 'puzzle' | 'especial') {
    this.itemSeleccionado = item;

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

  alternarInspeccion() {
    this.mostrarMenuInspeccion = !this.mostrarMenuInspeccion;
    if (!this.mostrarMenuInspeccion) {
      this.cerrarMiniMenu();
    }
  }

  // --- LÓGICA DEL ESCRITORIO ---
  abrirEscritorio() {
    this.mostrarEscritorioInterface = true;
    this.mostrarMenuInspeccion = false;
    this.cerrarMiniMenu();
    this.documentoActual = null;
  }

  cerrarEscritorio() {
    this.mostrarEscritorioInterface = false;
    this.documentoActual = null;
  }

  seleccionarDocumento(idDoc: number) {
    this.documentoActual = this.documentosDisponibles.find(d => d.id === idDoc) || null;

    if (this.documentoActual) {
      this.eventosService.sumarAccion();
    }
  }

  // --- LÓGICA GENERAL ---
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
        this.eventosService.sumarAccion();
        this.cerrarMiniMenu();
        this.cargarDatosDelLiving();
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

  interactuar() { }

  volver() {
    this.eventosService.sumarAccion();

    this.router.navigate(['/pasillo']);
  }
}
