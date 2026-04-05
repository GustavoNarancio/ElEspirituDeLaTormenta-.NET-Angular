import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from '../services/eventos-globales.service';
interface Libro {
  id: number;
  titulo: string;
  contenidoCompleto: string;
  paginas: string[];
}

@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.css']
})
export class CocinaComponent implements OnInit {

  mostrarMenuInspeccion: boolean = false;
  mostrarMiniMenu: boolean = false;
  mostrarDescripcion: boolean = false;
  mostrarPuzzleModal: boolean = false;
  textoLectura: string = '';
  itemSeleccionado: any = null;
  esPuzzle: boolean = false;

  viendoCajon: boolean = false;
  objetosPrincipales: any[] = [];
  objetosCajon: any[] = [];

  mostrarLibreriaInterface: boolean = false;
  librosDisponibles: Libro[] = [];
  libroActual: Libro | null = null;
  paginaActual: number = 0;

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService
) { }

  ngOnInit(): void {
    this.cargarDatosDeLaCocina();
    this.cargarTextosHardcodeados();

    this.apiService.inventarioCambio$.subscribe(() => {
      this.cargarDatosDeLaCocina();
    });
  }

  cargarDatosDeLaCocina() {
    const idHabitacion = 2;

    this.apiService.getObjetos(idHabitacion).subscribe({
      next: (datos) => {
        this.objetosCajon = datos.filter(obj => obj.nombre.toLowerCase().includes('fusible'));
        this.objetosPrincipales = datos.filter(obj => !obj.nombre.toLowerCase().includes('fusible'));
      },
      error: (err) => console.error("Error cargando objetos", err)
    });

    this.apiService.getPuzzles(idHabitacion).subscribe({
      next: (datos) => { },
      error: (err) => console.error("Error cargando puzzles", err)
    });
  }

  abrirAcciones(item: any, tipo: 'objeto' | 'puzzle' | 'libreria') {
    this.itemSeleccionado = item;

    if (tipo === 'libreria') {
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
      this.viendoCajon = false;
    }
  }

  abrirCajon() {
    this.eventosService.sumarAccion();

    this.viendoCajon = true;
    this.cerrarMiniMenu();
  }

  cerrarCajon() {
    this.viendoCajon = false;
    this.cerrarMiniMenu();
  }

  cargarTextosHardcodeados() {
    this.librosDisponibles = [
      // --- 1. COCINA (ESENCIAL - SIN MODIFICAR) ---
      {
        id: 1,
        titulo: 'Libro 1',
        paginas: [
          "Libro de Cocina\n“CUALQUIERA PUEDE COCINAR”\n\nDescubre los secretos gastronómicos del famoso chef Remy con este completo libro de cocina.\n\nUna colección única de recetas ancestrales, transmitidas de generación en generación, que capturan la esencia de los sabores y tradiciones de este mágico reino.",
          "Desde suculentas carnes asadas al estilo de los grandes banquetes reales hasta delicados pasteles elaborados con frutos de los bosques encantados, este libro ofrece una amplia variedad de platos para todas las ocasiones.\n\nCada receta es única, con instrucciones claras y fáciles de seguir, además de consejos del mejor chef: Remy.",
          "Ensalada de Pollo y Manzana\nIngredientes:\n- 2 pechugas de pollo cocidas y desmenuzadas\n- 1 manzana grande cortada en cubos \n- 1 taza de nueces picadas\n- 3 cucharadas de mayonesa\n- Jugo de limón\n- Sal y pimienta a gusto",
          "\nPreparación:\nEn un tazón grande mezcla el pollo desmenuzado, la manzana y las nueces.\n\nAñade la mayonesa y el jugo de limón, y mezcla bien.\n\nSazona con sal y pimienta al gusto. Sirve fría y disfruta.",
          "Pasta al Pesto\nIngredientes:\n- 200 gramos de pasta (espagueti o fettuccine)\n- ½ taza de hojas de albahaca frescas\n- ¼ de taza de queso parmesano rallado\n- 2 dientes de ajo\n- ⅓ de taza de aceite de oliva\n- Sal al gusto",
          "\nPreparación:Cocina la pasta hasta que esté al dente. Escurre y reserva. En una licuadora o procesador de alimentos mezcla la albahaca, los piñones, el queso parmesano y el ajo. Mientras mezclas, añade lentamente el aceite de oliva hasta obtener una salsa suave.\nSazona con sal al gusto. Mezcla la pasta cocida con el pesto y sirve caliente.",
          "Tostadas de Palta y Huevo\nIngredientes:\n- 2 rebanadas de pan integral\n- 1 palta madura\n- 2 huevos\n- 1 cucharada de jugo de limón\n- ¼ cucharadita de sal\n- ⅛ cucharadita de pimienta negra\n- Pizca de hojuelas de pimiento rojo",
          "\nPreparación:\nTuesta las rebanadas de pan hasta que estén doradas.\nEn un tazón machaca la palta con el jugo de limón, la sal y la pimienta. Cocina los huevos al gusto (fritos, revueltos o pochados).\n\nUnta la palta sobre las tostadas y coloca los huevos encima. Espolvorea con hojuelas de pimiento rojo si deseas un toque picante.",
          "Batido de Fresas y Plátano\nIngredientes:\n- 1 plátano maduro\n- 1 taza de fresas frescas o congeladas\n- ½ taza de yogur natural\n- ½ taza de leche\n- 1 cucharada de miel\n- ½ cucharadita de extracto de vainilla\n- Cubos de hielo a gusto",
          "\nPreparación:\nColoca el plátano, las fresas, el yogur, la leche, la miel y el extracto de vainilla en una licuadora.\n\nAñade unos cuantos cubos de hielo para obtener una textura más fría y espesa.\n\nLicua hasta que la mezcla esté suave y homogénea. Sirve inmediatamente y disfruta.",
          "Página estropeada por la humedad...",
          "Página estropeada por la humedad...",
          "Página estropeada por la humedad...",
          "Esta no es una página del libro.\n\nMás bien parece un papel viejo, pero bien cuidado, escrito por un nene:\n\n“Abuelita Mary, ¿podés hacerme la ensalada de pollo y manzana?\n\nTu ensalada de pollo y manzana es la más rica del mundo. Es mi comida favorita.\n\nTE AMO ABU.”",
          "Fin del libro."
        ],
        contenidoCompleto: ''
      },

      // --- 2. DECORACIÓN TEXTIL (FORMATO BITÁCORA A MANO) ---
      {
        id: 2,
        titulo: 'Libro 2',
        paginas: [
          "CUADERNO DE TALLER TEXTIL\n\n(La tapa es de cuero gastado. Las páginas están llenas de anotaciones a mano, garabatos y muestras de tela pegadas).",
          "Junio.\nEmpezar con el taller de decoración no es fácil. Hoy llegaron los primeros rollos de lienzo. El olor a algodón crudo inunda toda la habitación, pero es un buen comienzo.",
          "Nota rápida: \nNunca mezclar lino con fibras sintéticas si se busca una caída natural para cortinados pesados. El lino necesita respirar.",
          "Página ilegible, cubierta de moho...",
          "Página arruinada por la humedad...",
           "Acordarme de comprar telas color NEGRO, AZUL y ROJO. en genero pana y terciopelo",
          "Página arruinada por la humedad...",
          "(Hay un pedazo de tela gruesa pegado con un alfiler oxidado en esta página). \n\nPrueba de resistencia: La pana aguantó bien la fricción, pero el terciopelo pierde el pelo si se lo cepilla a contrapelo. No sirve para este proyecto.",
          "Tengo que afilar las tijeras grandes. Ya arruiné medio metro de muselina por un mal corte.",
          "El resto de las páginas están completamente pegadas entre sí por la humedad del lugar. Es imposible separarlas sin romperlas por completo.",
          "Fin del cuaderno."
        ],
        contenidoCompleto: ''
      },

      // --- 3. MECÁNICA (ESENCIAL - SIN MODIFICAR) ---
      {
        id: 3,
        titulo: 'Libro 3',
        paginas: [
          "LIBRO DE MECÁNICA\n\nDiagnóstico de Fallas Comunes en el Arranque\n\nEl sistema de arranque de un automóvil depende de múltiples componentes que deben funcionar en conjunto.",
          "Cuando uno de ellos falla, el vehículo puede presentar distintos comportamientos al intentar encender.\n\nObservar con atención qué ocurre al girar la llave es fundamental para identificar el problema.",
          "Fallas Relacionadas con la Batería (1/2)\n\nLa batería es la principal fuente de energía cuando el vehículo está apagado.\n\nSu función es alimentar el sistema eléctrico y permitir el arranque del motor.",
          "Fallas Relacionadas con la Batería (2/2)\n\nCuando la batería se encuentra descargada o en mal estado, el vehículo suele mostrar signos de debilidad eléctrica.\n\nEs común que el tablero apenas se ilumine o que las luces pierdan intensidad al intentar arrancar. En estos casos, el motor puede intentar encender sin éxito, e incluso apagarse por completo.",
          "Fallas en el Sistema de Fusibles (1/2)\n\nLos fusibles cumplen una función de protección dentro del sistema eléctrico del vehículo.\n\nAnte una sobrecarga o falla, se interrumpen para evitar daños mayores.",
          "Fallas en el Sistema de Fusibles (2/2)\n\nCuando un fusible importante se encuentra dañado, el circuito puede quedar completamente inactivo.\n\nEsto provoca que, al girar la llave, el vehículo no muestre ningún tipo de respuesta (ausencia total de luces, sonidos o intentos de arranque).",
          "Desgaste en el Motor de Arranque (1/2)\n\nEl motor de arranque es el encargado de poner en marcha el motor utilizando la energía de la batería.\n\nDentro de este sistema, los carbones son piezas que se desgastan con el uso.",
          "Desgaste en el Motor de Arranque (2/2)\n\nCuando están deteriorados, el funcionamiento es irregular. El vehículo puede intentar arrancar varias veces sin lograrlo.\n\nEn algunos casos, se perciben sonidos secos o golpes al accionar la llave, señal de que el mecanismo no funciona correctamente.",
          "Página estropeada por la humedad...",
          "Página estropeada por la humedad...",
          "Fin del libro (parece que el resto del libro está arruinado)"
        ],
        contenidoCompleto: ''
      },

      // --- 4. HELECHOS (FORMATO ENCICLOPEDIA / ÍNDICE) ---
      {
        id: 4,
        titulo: 'Libro 4',
        paginas: [
          "ENCICLOPEDIA ILUSTRADA \n DE LA \n FLORA DE INTERIOR\n\n\nVolumen IV: Polypodiopsida (Helechos)",
          "ÍNDICE DE CONTENIDOS\n\n1. Origen evolutivo ................. pág. 4\n2. Requisitos lumínicos ........... pág. 12\n3. Propagación por esporas ...... pág. 28\n4. Patologías comunes ............. pág. 45",
          "Capítulo 1: Origen Evolutivo.\n\nLos helechos conforman uno de los grupos de plantas vasculares más antiguos de la Tierra, datando del período Devónico...",
          "(Alguien arrancó violentamente un bloque entero de páginas desde la raíz. El lomo está roto en esta parte).",
          "Capítulo 4: Patologías comunes.\n\n...como se mencionaba en el capítulo anterior, la necrosis en los bordes de las frondas suele indicar una alarmante falta de humedad ambiental en el lugar de cultivo.",
          "Advertencia: El exceso de riego es el asesino silencioso del helecho doméstico. Provoca asfixia radicular y fomenta la aparición de hongos letales de los que no hay salvación.",
          "(El libro se corta abruptamente acá. Faltan todas las páginas finales y la contratapa de cartón).",
          "Fin del tomo."
        ],
        contenidoCompleto: ''
      }
    ];
  }

  abrirLibreria() {
    this.mostrarLibreriaInterface = true;
    this.mostrarMenuInspeccion = false;
    this.cerrarMiniMenu();
    this.libroActual = null;
    this.paginaActual = 0;
  }

  cerrarLibreria() {
    this.mostrarLibreriaInterface = false;
    this.libroActual = null;
    this.paginaActual = 0;
  }

  seleccionarLibro(idLibro: number) {
    this.libroActual = this.librosDisponibles.find(l => l.id === idLibro) || null;
    this.paginaActual = 0;
    if (this.libroActual) {
      this.eventosService.sumarAccion();
    }
  }

  cambiarPagina(incremento: number) {
    if (!this.libroActual) return;
    const nuevaPagina = this.paginaActual + incremento;
    if (nuevaPagina >= 0 && nuevaPagina < this.libroActual.paginas.length) {
      this.paginaActual = nuevaPagina;
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

  volver() {
    this.eventosService.sumarAccion();

    this.router.navigate(['/pasillo']);
  }

  interactuar() { }

  // ACÁ ESTABA EL ERROR: La función estaba vacía. Ahora llama a la base de datos.
  guardarItem() {
    if (!this.itemSeleccionado) return;

    this.apiService.guardarEnInventario(this.itemSeleccionado.id).subscribe({
      next: (res) => {
        this.eventosService.sumarAccion();
        console.log("Objeto guardado en la DB");
        this.cerrarMiniMenu();
        this.cargarDatosDeLaCocina(); // Recarga la lista para que desaparezca
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





  cerrarPuzzle() { }
}
