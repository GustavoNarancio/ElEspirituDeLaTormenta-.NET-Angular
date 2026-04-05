import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-final-por-movimientos',
  templateUrl: './final-por-movimientos.component.html',
  styleUrls: ['./final-por-movimientos.component.css']
})
export class FinalPorMovimientosComponent implements OnInit {

  escena: number = 1;
  textoMostrado: string = "";
  mostrarBotonSiguiente: boolean = false;
  mostrarBotonFin: boolean = false;
  intervalo: any;

  // Textos adaptados para el final donde la bestia te atrapa en la cabaña
  private textoEscena1: string = "Te invade el miedo. La cabaña se sacude como un terremoto, las ventanas revientan, los muebles caen y las luces menguan. Sientes la adrenalina corriendo por tu cuerpo; puedes escuchar a la bestia, sientes su inminente presencia.";

  private textoEscena2: string = "Corres hacia la puerta principal como nunca en tu vida, con la mirada fija al frente intentando escapar. De repente, un relámpago impacta directo en la cabaña y todo se apaga por completo. Un segundo después, los faroles vuelven a encenderse...";

  private textoEscena3: string = "El miedo te paraliza. La bestia está a escasos metros de ti, bloqueando la salida. Solo puedes admirar su terrorífica figura por un instante antes de que tu mente se apague para siempre...   EL ESPÍRITU DE LA TORMENTA  reclama un alma más.";

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.efectoEscritura(this.textoEscena1);
    }, 1500); // Pequeña pausa para que vean la imagen antes de que arranque el texto
  }

  efectoEscritura(texto: string) {
    this.textoMostrado = "";
    let i = 0;
    this.intervalo = setInterval(() => {
      if (i < texto.length) {
        this.textoMostrado += texto.charAt(i);
        i++;
      } else {
        clearInterval(this.intervalo);
        if (this.escena === 1 || this.escena === 2) {
          this.mostrarBotonSiguiente = true;
        } else if (this.escena === 3) {
          this.mostrarBotonFin = true;
        }
      }
    }, 25);
  }

  avanzarEscena() {
    this.mostrarBotonSiguiente = false;

    if (this.escena === 1) {
      this.escena = 2;
      this.efectoEscritura(this.textoEscena2);
    } else if (this.escena === 2) {
      this.escena = 3;
      this.efectoEscritura(this.textoEscena3);
    }
  }

  finalizarJuego() {
    this.router.navigate(['/agradecimiento']);
  }
}
