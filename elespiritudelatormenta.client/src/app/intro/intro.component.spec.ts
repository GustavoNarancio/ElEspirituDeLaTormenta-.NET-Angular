import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.css']
})
export class IntroComponent implements OnInit {

  escena: number = 1;
  tituloVisible: boolean = false;
  mostrarTitulo: boolean = true;
  mostrarMarco: boolean = false;
  mostrarFlecha: boolean = false;
  mostrarBotonJuego: boolean = false;

  textoMostrado: string = "";

  private textoBosque: string = "El viento aúlla entre los árboles, y la lluvia cae en torrentes, empapándote hasta los huesos. \n" +
    "Cada relámpago ilumina el paisaje sombrío, revelando sombras inquietantes que parecen moverse con vida propia.  De repente, a través del velo de la lluvia, ves a la criatura que ha estado viviendo en tus sueños desde que eras un niño \n" +
    "Es aterradora y majestuosa, mas de lo que jamás habrías imaginado, con ojos que brillan como brasas y una forma que desafía las leyes de la naturaleza. Un escalofrío recorre tu columna vertebral, tus piernas reaccionan antes que tu mente mientras te das cuenta de que estás en grave peligro. \n" +
    "Corres . Corres como nunca lo habías hecho en tu vida. La criatura te sigue, sus pasos retumban como truenos sobre el suelo empapado. \n";

  private textoCabania: string = "El bosque es un laberinto vivo, las ramas te rasgan la piel, las raíces quieren detenerte.\n" +
    "De repente, en un claro relámpago, divisas una cabaña a lo lejos. \n" +
    "Con lo último de tus fuerzas, te lanzas hacia ella. El sonido de la criatura se desvanece detrás de ti, y la cabaña se convierte en tu foco absoluto. \n" +
    "Llegas a la puerta de la cabaña, golpeándola con desesperación antes de girar la perilla y entrar.  Al cerrar la puerta de golpe detrás de ti, el ruido de la tormenta y los rugidos de la criatura se amortiguan, dejándote solo con el sonido de tu respiración agitada. Por ahora, estás a salvo…\n";

  ngOnInit(): void {
    this.iniciarSecuenciaBosque();
  }

  iniciarSecuenciaBosque() {
    this.escena = 1;
    this.textoMostrado = "";
    this.mostrarMarco = false;
    this.mostrarFlecha = false;
    this.mostrarBotonJuego = false;
    setTimeout(() => { this.tituloVisible = true; }, 50);
    setTimeout(() => { this.mostrarTitulo = false; }, 5000);
    setTimeout(() => { this.mostrarMarco = true; }, 5200);
    setTimeout(() => { this.efectoEscritura(this.textoBosque); }, 5400);
  }

  irACabania() {
    this.escena = 2;
    this.textoMostrado = "";
    this.mostrarMarco = false;
    this.mostrarFlecha = false;
    this.mostrarBotonJuego = false;

    setTimeout(() => { this.mostrarMarco = true; }, 1000);
    setTimeout(() => { this.efectoEscritura(this.textoCabania); }, 1500);
  }

  efectoEscritura(texto: string) {
    let i = 0;
    const intervalo = setInterval(() => {
      if (i < texto.length) {
        this.textoMostrado += texto.charAt(i);
        i++;
      } else {
        clearInterval(intervalo);
        if (this.escena === 1) {
          this.mostrarFlecha = true;
        } else {
          this.mostrarBotonJuego = true;
        }
      }
    }, 15);
  }
}
