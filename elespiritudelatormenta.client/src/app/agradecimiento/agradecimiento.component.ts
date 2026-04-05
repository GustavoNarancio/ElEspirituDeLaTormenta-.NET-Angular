import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-agradecimiento',
  templateUrl: './agradecimiento.component.html',
  styleUrls: ['./agradecimiento.component.css']
})
export class AgradecimientoComponent implements OnInit {

  textoMostrado: string = "";
  mostrarMarco: boolean = false;
  mostrarBotonVolver: boolean = false;

  private textoFinal: string = "Has llegado a un final, uno de varios.\n" +
    "Si fue uno desafortunado, te invito a jugarlo de nuevo para descubrir los otros finales.\n" +
    "Muchas gracias por haber jugado, espero lo hayas disfrutado tanto como yo disfruté haciéndolo.\n" +
    "También espero que hayas cuidado bien de Arlen Tolder, es solo un aventurero en busca de respuestas, como todos.\n\n" +
    "Gustavo \"Huesos\" Narancio.";

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Iniciamos la secuencia de agradecimiento
    setTimeout(() => { this.mostrarMarco = true; }, 500);
    setTimeout(() => { this.efectoEscritura(this.textoFinal); }, 1200);
  }

  efectoEscritura(texto: string) {
    let i = 0;
    const intervalo = setInterval(() => {
      if (i < texto.length) {
        this.textoMostrado += texto.charAt(i);
        i++;
      } else {
        clearInterval(intervalo);
        this.mostrarBotonVolver = true;
      }
    }, 30); // Un poquito más lento que la intro para darle peso emocional
  }

  volverAlMenu() {
    this.router.navigate(['/']); // O la ruta de tu menú principal
  }
}
