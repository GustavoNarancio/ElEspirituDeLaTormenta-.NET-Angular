import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-escape-final',
  templateUrl: './escape-final.component.html',
  styleUrls: ['./escape-final.component.css']
})
export class EscapeFinalComponent implements OnInit {

  textoMostrado: string = "";
  mostrarBotonFin: boolean = false;

  // TEXTO LIMPIO DE SALTOS DE LÍNEA INNECESARIOS
  private textoFinal: string = "Te subes a la camioneta buscando el control de la puerta del garaje, pero encuentras en la guantera un papel doblado. Es un mapa del bosque con puntos y marcas. Hay caminos marcados como “Seguros” y locaciones específicas con marcas extrañas. Una de ellas tiene el nombre de tu abuelo...\n\nTu corazón se acelera. Buscas desesperadamente el control, abres la puerta del garaje y sales a toda velocidad sin mirar atrás, siguiendo el mapa. Apenas sales de la cabaña lo logras escuchar: es un ruido inconfundible. El rugido de la bestia se funde con la tormenta. Aceleras más. Tienes que llegar, tienes que saber qué pasó y tienes que llegar antes de que la tormenta te devore, antes de que el ESPÍRITU DE LA TORMENTA reclame tu alma...";

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Pequeña pausa antes de empezar
    setTimeout(() => {
      this.efectoEscritura(this.textoFinal);
    }, 1500);
  }

  efectoEscritura(texto: string) {
    let i = 0;
    const intervalo = setInterval(() => {
      if (i < texto.length) {
        this.textoMostrado += texto.charAt(i);
        i++;
      } else {
        clearInterval(intervalo);
        // Cuando termina de escribir todo, mostramos el botón FIN
        this.mostrarBotonFin = true;
      }
    }, 25); // Velocidad de tipeo
  }

  finalizarJuego() {
    // Mandamos al usuario a la intro o menú principal
    this.router.navigate(['/agradecimiento']);
  }
}

