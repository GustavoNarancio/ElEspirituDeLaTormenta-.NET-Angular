import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventosGlobalesService } from '../services/eventos-globales.service';

@Component({
  selector: 'app-catacumbas',
  templateUrl: './catacumbas.component.html',
  styleUrls: ['./catacumbas.component.css']
})
export class CatacumbasComponent implements OnInit {

  escena: number = 1;
  textoMostrado: string = "";
  mostrarBotonSiguiente: boolean = false;
  mostrarBotonFin: boolean = false;
  intervalo: any;

  private textoEscena1: string = "Al pasar por la puerta, automáticamente se enciende una runa violeta, que a su vez prende una antorcha en la pared. La tomas y la apuntas hacia adelante para poder ver algo.\n\nDe repente, desde las escaleras asciende un aire frío y húmedo, envolviéndote en una sensación de misterio e incertidumbre.\n\nA cada paso, las paredes de piedra revelan extrañas inscripciones que brillan con un tenue tono violeta.\n\nAnte ti, no puedes creer lo que ven tus ojos: una ciudad entera encerrada bajo tierra, claro, por eso nadie nunca la habia encontrado.";

  private textoEscena2: string = "A medida que bajas las escaleras, te das cuenta de que has cumplido el sueño de tu abuelo. La encontraste… encontraste Orasul Fortunii. Estás a punto de conocer la verdad que tanto esperaste, lo que tanto buscaste… quizás incluso respuestas sobre lo que le pasó a tu abuelo.\n\nCon un último vistazo a la puerta detrás de ti, te sumerges completamente en la oscuridad de la escalera, sin saber con qué te encontrarás o quien te encuentre a tí.";

  constructor(private router: Router, private eventosService: EventosGlobalesService
) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.efectoEscritura(this.textoEscena1);
    }, 1500);
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
        if (this.escena === 1) {
          this.mostrarBotonSiguiente = true;
        } else if (this.escena === 2) {
          this.mostrarBotonFin = true;
        }
      }
    }, 25);
  }

  avanzarEscena() {
    this.escena = 2;
    this.mostrarBotonSiguiente = false;
    this.efectoEscritura(this.textoEscena2);
  }

  finalizarJuego() {
    this.router.navigate(['/agradecimiento']);
  }
}
