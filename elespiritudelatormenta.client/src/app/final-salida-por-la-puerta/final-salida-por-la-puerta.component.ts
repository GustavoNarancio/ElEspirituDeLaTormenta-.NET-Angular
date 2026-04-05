import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-final-salida-por-la-puerta',
  templateUrl: './final-salida-por-la-puerta.component.html',
  styleUrls: ['./final-salida-por-la-puerta.component.css']
})
export class FinalSalidaPorLaPuertaComponent implements OnInit {

  escena: number = 1;
  textoMostrado: string = "";
  mostrarBotonSiguiente: boolean = false;
  mostrarBotonFin: boolean = false;
  intervalo: any;

  private textoEscena1: string = "Tras un breve descanso, empiezas a escuchar unos ruidos extraños que provienen de todas partes, empiezan a retumbar en tus oídos, te ensordecen.\n\nTodo se empieza a volver diminuto, las paredes se van cerrando sobre ti poco a poco.\n\nHay algo en esta cabaña que te está afectando fuertemente; no puedes respirar y empiezas a sentir una presencia en la habitación.";

  private textoEscena2: string = "Algo no anda bien, no puedes respirar con facilidad, tu visión se nubla. Antes de colapsar, sales corriendo y abres la puerta sin pensarlo.\n\nEl aire puro del bosque te calma, pero te das cuenta de que estás afuera de nuevo… El miedo te invade.\n\nTratas de volver a la cabaña, pero la puerta está cerrada, se trabó y no cede.\n\nUn estruendo te paraliza. Te das vuelta y la ves de nuevo: está a pocos metros tuyos, entre los árboles.";

  private textoEscena3: string = "Empiezas a correr hacia el lado opuesto, pero sus pisadas son cada vez más fuertes y su rugido te ensordece.\n\nTu cuerpo no aguanta más. Te tropiezas con una rama y quedas tirado en el piso boca arriba con la lluvia golpeándote la cara.\n\nEn un abrir y cerrar de ojos aparece frente a ti. Todo se silencia por un instante. La lluvia se paraliza, no hay ruido, ya no sientes nada...\n\nEL ESPÍRITU DE LA TORMENTA reclama un alma más.";

  constructor(private router: Router) { }

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
