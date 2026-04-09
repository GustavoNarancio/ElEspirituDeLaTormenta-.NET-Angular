import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from '../services/eventos-globales.service';

@Component({
  selector: 'app-el-espiritu-de-la-tormenta',
  templateUrl: './el-espiritu-de-la-tormenta.component.html',
  styleUrl: './el-espiritu-de-la-tormenta.component.css'
})
export class ElEspirituDeLaTormentaComponent implements OnInit {

  // --- MÁQUINA DE ESTADOS DE ESCENAS ---
  // 0: Intro Pag 1
  // 1: Intro Pag 2
  // 2: Intro Pag 3
  // 3: Interfaz Mochila/Juego
  // 4: Texto Éxito Amuleto - PARTE 1 (Flecha)
  // 5: Texto Éxito Amuleto - PARTE 2 (Cerrar)
  // 6: Pantalla Negra Final con animación
  escena: number = 0;

  inventarioUsuario: any[] = [];
  itemSeleccionado: any = null;

  mostrarMiniMenu: boolean = false;
  mostrarErrorRanura: boolean = false;

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService) { }
  ngOnInit(): void {
    // --- LEYENDO EL ID EXACTO DE TU LOGIN ---
    const usuarioStorage = localStorage.getItem('idUsuarioActual');
    const idUsuarioActual = usuarioStorage ? parseInt(usuarioStorage, 10) : 1;

    this.apiService.getInventario(idUsuarioActual).subscribe(datos => {
      this.inventarioUsuario = datos;
    });
  }

  avanzarEscena() {
    this.escena++;
    this.cerrarMiniMenu();
  }

  abrirMiniMenu(item: any) {
    if (this.mostrarErrorRanura) return;
    this.itemSeleccionado = item;
    this.mostrarMiniMenu = true;
  }

  cerrarMiniMenu() {
    this.mostrarMiniMenu = false;
    this.itemSeleccionado = null;
  }

  usarObjeto() {
    this.mostrarMiniMenu = false;
    this.eventosService.sumarAccion();

    if (this.itemSeleccionado.id === 20 || this.itemSeleccionado.Id === 20) {
      this.escena = 4; // Éxito Parte 1
    } else {
      this.mostrarErrorRanura = true; // Error modal
    }
  }

  cerrarError() {
    this.mostrarErrorRanura = false;
    this.itemSeleccionado = null;
  }

  cerrarExitoAmuleto() {
    this.escena = 6; // Pantalla final animada
  }

  irACatacumbas() {
    this.router.navigate(['/catacumbas'], { replaceUrl: true });
  }

  volverAtras() {
    this.eventosService.sumarAccion();
    this.router.navigate(['/sotano'], { replaceUrl: true });
  }

  volverDePantallaNegra() {
    this.escena = 3; // Regresa a la interfaz normal
  }
}
