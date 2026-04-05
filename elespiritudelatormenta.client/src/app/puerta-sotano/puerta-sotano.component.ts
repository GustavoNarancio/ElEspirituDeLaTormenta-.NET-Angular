import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from '../services/eventos-globales.service';

@Component({
  selector: 'app-puerta-sotano',
  templateUrl: './puerta-sotano.component.html',
  styleUrls: ['./puerta-sotano.component.css']
})
export class PuertaSotanoComponent implements OnInit {
  // Estados de UI
  mostrarMiniMenu: boolean = false;
  mostrarDescripcion: boolean = true;
  puzzleResuelto: boolean = false;

  // Paginación de lectura
  paginasTexto: string[] = ['La puerta es maciza. El candado es enorme y no tengo la llave, pero parece que la traba que lo sostiene está muy oxidada y gastada'];
  paginaActual: number = 0;
  textoLectura: string = this.paginasTexto[0];

  itemSeleccionado: any = null;
  inventarioUsuario: any[] = [];

  readonly ID_HACHA = 1;
  readonly ID_PUZZLE_SOTANO = 5;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private eventosService: EventosGlobalesService
  ) { }

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario() {
    const idUsuarioActual = 1;
    this.apiService.getInventario(idUsuarioActual).subscribe(datos => {
      this.inventarioUsuario = datos;
    });
  }

  abrirAcciones(item: any) {
    this.itemSeleccionado = item;
    this.mostrarMiniMenu = true;
  }

  cerrarMiniMenu() {
    this.mostrarMiniMenu = false;
    this.itemSeleccionado = null;
  }

  cerrarLectura() {
    this.mostrarDescripcion = false;
  }

  // --- LÓGICA NUEVA DE PAGINACIÓN ---
  procesarTextoLectura(textoRaw: string) {
    // Corta el texto donde encuentre "||" y arma las páginas
    this.paginasTexto = textoRaw.split('||');
    this.paginaActual = 0;
    this.textoLectura = this.paginasTexto[this.paginaActual];
    this.mostrarDescripcion = true;
  }

  avanzarPagina() {
    if (this.paginaActual < this.paginasTexto.length - 1) {
      this.paginaActual++;
      this.textoLectura = this.paginasTexto[this.paginaActual];
    }
  }
  // ----------------------------------

  usarItem() {
    if (!this.itemSeleccionado) return;
    this.eventosService.sumarAccion();

    this.apiService.intentarLlave(this.ID_PUZZLE_SOTANO, this.itemSeleccionado.id).subscribe({
      next: (res) => {
        this.puzzleResuelto = true;
        this.procesarTextoLectura(res.mensaje); // Procesamos el mensaje con éxito
        this.mostrarMiniMenu = false;
      },
      error: (err) => {
        const msjError = err.error.mensaje || "No puedo abrir la puerta con eso.";
        this.procesarTextoLectura(msjError); // Procesamos el mensaje con error
        this.mostrarMiniMenu = false;
      }
    });
  }

  entrarAlSotano() {
    this.eventosService.sumarAccion();
    this.router.navigate(['/sotano']);
  }

  volverAlPasillo() {
    this.eventosService.sumarAccion();
    this.router.navigate(['/pasillo']);
  }
}
