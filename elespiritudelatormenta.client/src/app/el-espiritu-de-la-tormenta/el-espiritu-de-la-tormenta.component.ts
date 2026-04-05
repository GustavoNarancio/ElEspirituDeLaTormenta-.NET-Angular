import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from '../services/eventos-globales.service';
@Component({
  selector: 'app-el-espiritu-de-la-tormenta',
  templateUrl: './el-espiritu-de-la-tormenta.component.html',
  styleUrls: ['./el-espiritu-de-la-tormenta.component.css']
})
export class ElEspirituDeLaTormentaComponent implements OnInit {

  // 0: Primer texto (Imagen 4), 1: Segundo texto (Imagen 5), 2: Juego/Mochila (Imagen 6)
  escena: number = 0;

  inventarioUsuario: any[] = [];
  itemSeleccionado: any = null;

  mostrarMiniMenu: boolean = false;
  mostrarErrorRanura: boolean = false;

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService
) { }

  ngOnInit(): void {
    // Cargamos la mochila del usuario 1
    this.apiService.getInventario(1).subscribe(datos => {
      this.inventarioUsuario = datos;
    });
  }

  avanzarEscena() {
    this.escena++;
  }

  abrirMiniMenu(item: any) {
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
    // Verificamos si es el Amuleto
    if (this.itemSeleccionado.id === 1015 || this.itemSeleccionado.Id === 1015) {
      this.escena = 3; // Pasamos a la escena de éxito del amuleto
    } else {
      this.mostrarErrorRanura = true;
    }
  }

  // Nueva función para cuando tocás "CERRAR" en el texto de éxito
  cerrarExitoAmuleto() {
    this.escena = 4;
  }

  // Nueva función para ir a las catacumbas
  irACatacumbas() {
    this.router.navigate(['/catacumbas']); // Asegurate de que esta ruta exista en app-routing.module.ts
  }

  cerrarError() {
    this.mostrarErrorRanura = false;
    this.itemSeleccionado = null;
  }

  volverAtras() {
    this.eventosService.sumarAccion();

    this.router.navigate(['/sotano']);
  }

  // Nueva función para volver a la puerta desde la pantalla negra
  volverDePantallaNegra() {
    this.escena = 2; // Vuelve a la escena de la mochila
  }

}
