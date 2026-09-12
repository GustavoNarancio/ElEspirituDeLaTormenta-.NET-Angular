import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

  // --- NUEVA VARIABLE PREGUNTA INICIAL ---
  mostrarPreguntaInicial: boolean = true;

  // Variables de control de fase y UI
  faseIntro: number = 1;
  subFasePrologo: number = 1;
  subFasePersecucion: number = 1;

  mostrarMarco: boolean = false;
  mostrarFlecha: boolean = false;
  mostrarBotonJuego: boolean = false;

  // Variables para los fondos dinámicos y transiciones
  mostrarFondoPrologo: boolean = true;
  mostrarFondoLogo: boolean = false;
  mostrarNegroAbsoluto: boolean = false;
  mostrarFondoPersecucionBosque: boolean = false;

  textoMostrado: string = "";

  // --- TEXTO PRÓLOGO (Thaddeus Tolder) dividido en páginas ---
  private textoPrologoPag1: string = "AÑO 1914. El famoso explorador Thaddeus Tolder hace público, " +
    "por fin, su más reciente descubrimiento. Al descifrar una vieja tabla de piedra " +
    "hallada en uno de sus viajes, logró dar con la ubicación exacta de la mítica " +
    "Orasul Fortunii (que en su idioma original se traduce como la \"Ciudad de " +
    "la Tormenta\"), la legendaria ciudad construida por los antiguos habitantes " +
    "de Valea Furtunii.\n\n" +
    "Múltiples indicios le demostraron a Thaddeus que la leyenda " +
    "era real. Todo el mundo conoce la historia del dios que habita en esas tierras: " +
    "el dios que no tiene forma, pero que puede caminar y moverse como un rayo. Un " +
    "ente al que veneran los Valea Furtunii y del cual recibieron un poder " +
    "inimaginable, lo llamaron \"EL ESPÍRITU DE LA TORMENTA\".";

  private textoPrologoPag2: string = "Para muchos no son más que simples mitos. Pero Tolder, " +
    "movido por esta nueva información, partió a toda prisa hacia Rumania, " +
    "adentrándose en las cercanías del sombrío bosque Hoia Baciu, donde hoy apenas " +
    "se levanta un pequeño y aislado pueblo.\n\n" +
    "Su investigación se prolongó durante años, hasta que, " +
    "repentinamente, Thaddeus Tolder desapareció sin dejar rastro. Sus cartas " +
    "dejaron de llegar y nadie supo más de él. Las autoridades investigaron, pero el " +
    "caso fue cerrado rápidamente por falta de pruebas.\n\n" +
    "O al menos, eso es lo que le dijeron a la prensa.";

  private textoPrologoPag3: string = "Poco antes de esfumarse, mi abuelo me envió una carta que " +
    "decía que estaba a punto de lograr su objetivo, y que pronto podría unirme a él " +
    "para concluir la expedición y compartir el honor de descubrir los secretos de " +
    "la civilización más enigmática de la historia. No tiene ningún sentido que se " +
    "haya marchado sin avisar. Algo le pasó... o alguien hizo que le pasara.\n\n" +
    "Sea como sea, no me voy a quedar esperando. Voy a buscar " +
    "respuestas por mi cuenta. Aún recuerdo cuando me regaló mi primer sombrero " +
    "de explorador cuando era pequeño, mientras me contaba fascinantes historias sobre los Valea Furtunii. " +
    "Soy un hombre  ahora y si las autoridades no quieren buscarlo, yo puedo encontrarlo solo…" +
    "y si mi abuelo tenía razón, puede que no sea lo único que encuentre.";

  // --- TEXTO PERSECUCIÓN (Bosque/Cabaña) ---
  private textoBosque: string = "El viento aúlla entre los árboles, y la lluvia cae en torrentes, empapándote hasta los huesos. \n" +
    "Cada relámpago ilumina el paisaje sombrío, revelando sombras inquietantes que parecen moverse con vida propia.  De repente, a través del velo de la lluvia, ves a la criatura que ha estado viviendo en tus sueños desde que eras un niño. \n" +
    "Es aterradora y majestuosa, mas de lo que jamás habrías imaginado, con ojos que brillan como brasas y una forma que desafía las leyes de la naturaleza. Un escalofrío recorre tu columna vertebral, tus piernas reaccionan antes que tu mente mientras te das cuenta de que estás en grave peligro. \n" +
    "Corres . Corres como nunca lo habías hecho en tu vida. La criatura te sigue, sus pasos retumban como truenos sobre el suelo empapado. \n";

  private textoCabania: string = "El bosque es un laberinto vivo, las ramas te rasgan la piel, las raíces quieren detenerte.\n" +
    "De repente, en un claro relámpago, divisas una cabaña a lo lejos. \n" +
    "Con lo último de tus fuerzas, te lanzas hacia ella. El sonido de la criatura se desvanece detrás de ti, y la cabaña se convierte en tu foco absoluto. \n" +
    "Llegas a la puerta de la cabaña, golpeándola con desesperación antes de girar la perilla y entrar.  Al cerrar la puerta de golpe detrás de ti, el ruido de la tormenta y los rugidos de la criatura se amortiguan, dejándote solo con el sonido de tu respiración agitada. Por ahora, estás a salvo…\n";

  constructor(private router: Router) { }

  ngOnInit(): void {
    // El juego arranca pausado esperando la respuesta del jugador.
    // No llamamos a iniciarSecuenciaPrologo() acá.
  }

  // --- NUEVA FUNCIÓN PARA EL BOTÓN DE PREGUNTA ---
  responderPrimeraPartida(esPrimera: boolean) {
    this.mostrarPreguntaInicial = false; // Ocultamos el cartel

    if (esPrimera) {
      // Si es su primera vez, arrancamos el prólogo normalmente
      this.iniciarSecuenciaPrologo();
    } else {
      // Si pone que NO, lo mandamos directo al juego
      this.router.navigate(['/juego'], { replaceUrl: true });
    }
  }

  // --- FASE 1: PRÓLOGO (Thaddeus) ---
  iniciarSecuenciaPrologo() {
    this.faseIntro = 1;
    this.subFasePrologo = 1;

    setTimeout(() => {
      this.mostrarMarco = true;
      setTimeout(() => {
        this.efectoEscritura(this.textoPrologoPag1);
      }, 200);
    }, 2000);
  }

  avanzar() {
    this.mostrarFlecha = false;
    this.textoMostrado = "";

    if (this.faseIntro === 1) {
      this.avanzarPrologo();
    } else if (this.faseIntro === 4) {
      this.irACabania();
    }
  }

  avanzarPrologo() {
    this.subFasePrologo++;

    if (this.subFasePrologo === 2) {
      this.efectoEscritura(this.textoPrologoPag2);
    } else if (this.subFasePrologo === 3) {
      this.efectoEscritura(this.textoPrologoPag3);
    } else {
      this.iniciarSecuenciaLogo();
    }
  }

  // --- FASE 2: PRESENTACIÓN DEL LOGO ---
  iniciarSecuenciaLogo() {
    this.faseIntro = 2;
    this.mostrarMarco = false;
    this.mostrarNegroAbsoluto = true;

    setTimeout(() => {
      this.mostrarFondoPrologo = false;

      setTimeout(() => {
        this.mostrarNegroAbsoluto = false;
        this.mostrarFondoLogo = true;

        setTimeout(() => {
          this.iniciarTransicionHaciaBosque();
        }, 6000);
      }, 500);
    }, 100);
  }

  // --- FASE 3: TRANSICIÓN HACIA EL BOSQUE ---
  iniciarTransicionHaciaBosque() {
    this.faseIntro = 3;
    this.mostrarFondoLogo = false;
    this.mostrarNegroAbsoluto = true;

    setTimeout(() => {
      this.mostrarNegroAbsoluto = false;
      this.mostrarFondoPersecucionBosque = true;

      setTimeout(() => {
        this.iniciarSecuenciaPersecucion();
      }, 3000);
    }, 2000);
  }

  // --- FASE 4: PERSECUCIÓN ---
  iniciarSecuenciaPersecucion() {
    this.faseIntro = 4;
    this.subFasePersecucion = 1;
    this.textoMostrado = "";

    setTimeout(() => { this.mostrarMarco = true; }, 200);
    setTimeout(() => { this.efectoEscritura(this.textoBosque); }, 400);
  }

  irACabania() {
    this.subFasePersecucion = 2;
    this.textoMostrado = "";
    this.mostrarMarco = false;
    this.mostrarFlecha = false;
    this.mostrarBotonJuego = false;

    setTimeout(() => { this.mostrarMarco = true; }, 1000);
    setTimeout(() => { this.efectoEscritura(this.textoCabania); }, 1500);
  }

  // --- EFECTO ESCRITURA MÁQUINA ---
  efectoEscritura(texto: string) {
    let i = 0;
    const intervalo = setInterval(() => {
      if (i < texto.length) {
        this.textoMostrado += texto.charAt(i);
        i++;
      } else {
        clearInterval(intervalo);
        if (this.faseIntro === 1) {
          this.mostrarFlecha = true;
        } else if (this.faseIntro === 4) {
          if (this.subFasePersecucion === 1) {
            this.mostrarFlecha = true;
          } else {
            this.mostrarBotonJuego = true;
          }
        }
      }
    }, 20);
  }

  finalizarIntro() {
    this.router.navigate(['/juego']);
  }
}
