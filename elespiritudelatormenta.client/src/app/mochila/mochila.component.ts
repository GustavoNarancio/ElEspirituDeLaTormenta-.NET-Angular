import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';

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

  constructor(private apiService: ApiService) { }

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
    const idUsuarioActual = 1;
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
    const idUsuarioActual = 1;

    this.apiService.devolverObjeto(idUsuarioActual, this.itemSeleccionado.id).subscribe({
      next: () => {
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
