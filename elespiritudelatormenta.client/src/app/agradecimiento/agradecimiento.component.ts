import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service'; // Importamos el ApiService

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

  constructor(private router: Router, private apiService: ApiService) { }

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

  // --- NUEVA LÓGICA DE DESTRUCCIÓN DE PARTIDA ---
  reiniciarJuego() {
    // Leemos el ID ANTES de borrarlo para pasarlo a la API
    const idParaBorrar = localStorage.getItem('idUsuarioActual');

    // 1. Borramos el "DNI" de la memoria INMEDIATAMENTE de forma síncrona
    localStorage.removeItem('idUsuarioActual');
    localStorage.clear(); // Limpieza nuclear por las dudas

    if (idParaBorrar) {
      // 2. Le pedimos a C# que borre (no nos importa tanto la respuesta si ya lo borramos local)
      this.apiService.borrarPartidaActual().subscribe({
        next: () => {
          this.router.navigate(['/login'], { replaceUrl: true });
        },
        error: (err) => {
          console.error("Error al borrar en DB", err);
          // Viajamos igual
          this.router.navigate(['/login'], { replaceUrl: true });
        }
      });
    } else {
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
}
