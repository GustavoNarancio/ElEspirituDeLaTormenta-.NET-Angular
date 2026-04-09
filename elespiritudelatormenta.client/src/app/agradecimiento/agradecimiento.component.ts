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
    // 1. Le pedimos a C# que borre todo nuestro progreso en la Base de Datos
    this.apiService.borrarPartidaActual().subscribe({
      next: () => {
        // 2. Borramos el "DNI" de la memoria del navegador
        localStorage.removeItem('idUsuarioActual');

        // 3. Lo mandamos al Login de nuevo, limpiando el historial
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: (err) => {
        console.error("Error al borrar la partida en la DB", err);
        // Fallback: Si falla el backend, igual borramos la sesión local para que el jugador no quede atrapado
        localStorage.removeItem('idUsuarioActual');
        this.router.navigate(['/login'], { replaceUrl: true });
      }
    });
  }
}
