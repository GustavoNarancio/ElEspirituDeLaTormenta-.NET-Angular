import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from '../services/eventos-globales.service';

// 1. CAMBIO: Ahora en lugar de "texto: string", usamos un array de páginas
interface Documento {
  id: number;
  tituloBoton: string;
  paginas: string[];
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

  // 2. NUEVA VARIABLE: Para saber en qué página estamos
  paginaActualIndex: number = 0;

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService) { }

  ngOnInit(): void {
    this.cargarDatosDelLiving();
    this.cargarTextosEscritorio();

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
        paginas: [
          "Una hoja de papel arrugada y ligeramente amarillenta, con una lista de compras escrita a mano.\n\nSe pueden leer elementos como:\nLeche, Pan, Huevos y Café.",
          "La letra es apresurada pero clara, y hay pequeñas marcas de verificación junto a algunos de los artículos, indicando que ya han sido comprados."
        ]
      },
      {
        id: 2,
        tituloBoton: 'Nota 1',
        paginas: [
          "Un pequeño trozo de papel colorido con una cita motivacional escrita en negrita:\n\n“La vida es un 10% lo que te ocurre y un 90% cómo reaccionas a ello.”",
          "Esta nota está pegada con cinta adhesiva en la esquina del escritorio, como si fuera una fuente constante de inspiración y recordatorio diario."
        ]
      },
      {
        id: 3,
        tituloBoton: 'Nota 2',
        paginas: [
          " 01/02/17 \n Una nota de papel cuidadosamente doblada con el título:\n\n“No olvidar combinación de fusibles  ”\n\nAl desdoblarla se revela una lista de colores:\n\nVerde– Rojo – Azul – Marron"
        ]
      },
      {
        id: 4,
        tituloBoton: 'Libro 1',
        paginas: [
          "Un libro de tapa dura y cuero gastado.El título dice: 'Mitos y Costumbres de los Valea Furtunii'.\n\nLa introducción detalla cómo esta tribu vivió aislada durante siglos, dedicando su existencia a apaciguar a una deidad feroz conocida como el Espíritu de la Tormenta.",
          "La página 42 tiene el borde doblado. El texto resalta:\n\n'La deidad era el caos absoluto, y para controlarla, la tribu se aferró al orden perfecto de la naturaleza. Para los Valea Furtunii, las cuatro puertas del gran ciclo de la tierra no eran simples temporadas, eran etapas de un ritual sagrado.'"
        ]
      },
      {
        id: 5,
        tituloBoton: 'Nota 4',
        paginas: [
          "02/02/17 \n Se rompió la caja de fusibles de nuevo, tuvo que venir el electricista, estaban mal colocados los fusibles. Me dijo que tienen que quedar:\n\nMarron – Verde – Rojo – Azul  no encontramos los fusibles, no se donde los dejaste, pero que queden como te puse "
        ]
      },

      {
        id: 6,
        tituloBoton: 'Papel 2',
        paginas: [
          "Una nota pequeña y sin firma que estaba dentro de un sobre vacío con olor a humedad:\n\n'Su cooperación cerrando el caso del explorador tan rápido ha sido muy apreciada por las familias fundadoras del pueblo. El dinero ya fue entregado a su esposa. Asegúrese de que el bosque siga en silencio.'"
        ]
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

  abrirEscritorio() {
    this.mostrarEscritorioInterface = true;
    this.mostrarMenuInspeccion = false;
    this.cerrarMiniMenu();
    this.documentoActual = null;
    this.paginaActualIndex = 0; // Reseteamos al abrir
  }

  cerrarEscritorio() {
    this.mostrarEscritorioInterface = false;
    this.documentoActual = null;
  }

  seleccionarDocumento(idDoc: number) {
    this.documentoActual = this.documentosDisponibles.find(d => d.id === idDoc) || null;
    this.paginaActualIndex = 0; // Siempre vuelve a la página 1 al cambiar de documento

    if (this.documentoActual) {
      this.eventosService.sumarAccion();
    }
  }

  // 3. FUNCIONES DE PAGINACIÓN
  paginaSiguiente() {
    if (this.documentoActual && this.paginaActualIndex < this.documentoActual.paginas.length - 1) {
      this.paginaActualIndex++;
    }
  }

  paginaAnterior() {
    if (this.paginaActualIndex > 0) {
      this.paginaActualIndex--;
    }
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
    this.router.navigate(['/pasillo'], { replaceUrl: true });
  }
}
