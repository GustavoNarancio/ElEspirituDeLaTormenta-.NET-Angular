import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from '../services/eventos-globales.service';

@Component({
  selector: 'app-mochila',
  templateUrl: './mochila.component.html',
  styleUrls: ['./mochila.component.css']
})
export class MochilaComponent {
  mostrarMochila: boolean = false;
  itemsMochila: any[] = [];

  // NUEVAS VARIABLES
  itemSeleccionado: any = null;
  mostrarMiniMenu: boolean = false;
  mostrarLectura: boolean = false;

  constructor(private apiService: ApiService, private eventosService: EventosGlobalesService) { }

  abrirMochila() {
    this.mostrarMochila = true;
    this.cargarObjetosDeLaMochila();
  }

  cerrarMochila() {
    this.mostrarMochila = false;
    this.cerrarMiniMenu(); // Por las dudas, cerramos todo al salir
    this.cerrarLectura();
  }

  cargarObjetosDeLaMochila() {
    // --- LEYENDO EL ID EXACTO DEL LOGIN ---
    const usuarioStorage = localStorage.getItem('idUsuarioActual');
    const idUsuarioActual = usuarioStorage ? parseInt(usuarioStorage, 10) : 1;

    this.apiService.getInventario(idUsuarioActual).subscribe({
      next: (datos) => this.itemsMochila = datos,
      error: (err) => console.error('Error:', err)
    });
  }

  // NUEVAS FUNCIONES
  abrirAcciones(item: any) {
    this.itemSeleccionado = item;
    this.mostrarMiniMenu = true;
  }

  cerrarMiniMenu() {
    this.mostrarMiniMenu = false;
  }

  verDescripcion() {
    this.mostrarMiniMenu = false;
    this.mostrarLectura = true;
  }

  cerrarLectura() {
    this.mostrarLectura = false;
  }

  devolverItem() {
    if (!this.itemSeleccionado) return;

    // --- LEYENDO EL ID EXACTO DEL LOGIN ---
    const usuarioStorage = localStorage.getItem('idUsuarioActual');
    const idUsuarioActual = usuarioStorage ? parseInt(usuarioStorage, 10) : 1;

    this.apiService.devolverObjeto(idUsuarioActual, this.itemSeleccionado.id).subscribe({
      next: () => {
        this.eventosService.sumarAccion();

        console.log("Objeto devuelto");
        this.cerrarMiniMenu();
        this.cargarObjetosDeLaMochila(); // Recargamos para que desaparezca visualmente
        // LA MOCHILA TOCA EL BOTÓN DE LA RADIO:
        this.apiService.notificarCambioInventario();
      },
      error: (err) => console.error(err)
    });
  }
}
