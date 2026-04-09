import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';
import { EventosGlobalesService } from "../services/eventos-globales.service"; 
@Component({
  selector: 'app-puerta-garaje',
  templateUrl: './puerta-garaje.component.html',
  styleUrls: ['./puerta-garaje.component.css']
})
export class PuertaGarajeComponent implements OnInit {
  // Estados de UI
  mostrarMiniMenu: boolean = false;
  mostrarDescripcion: boolean = true; // Empieza mostrando el texto de la puerta
  puzzleResuelto: boolean = false;

  textoLectura: string = 'Esta debe ser la puerta del garaje. La puerta está cerrada con llave, no veo otra forma de entrar ni de abrirla.';
  itemSeleccionado: any = null;
  inventarioUsuario: any[] = [];

  readonly ID_LLAVE_GARAJE = 1011;
  readonly ID_PUZZLE_PUERTA = 4;

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService
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

  usarItem() {
    if (!this.itemSeleccionado) return;

    this.eventosService.sumarAccion();
    // Llamamos al nuevo método que espera UN solo objeto
    this.apiService.intentarLlave(this.ID_PUZZLE_PUERTA, this.itemSeleccionado.id).subscribe({
      next: (res) => {
        // Si el backend dice OK, es porque era la llave 1011
        this.textoLectura = res.mensaje;
        this.puzzleResuelto = true;
        this.mostrarMiniMenu = false;
        this.mostrarDescripcion = true;
      },
      error: (err) => {
        // Si el backend tira error (400), es porque no era la llave
        this.textoLectura = err.error.mensaje || "No puedo abrir la puerta con eso.";
        this.mostrarMiniMenu = false;
        this.mostrarDescripcion = true;
      }
    });
  }

  entrarAlGaraje() {
    this.eventosService.sumarAccion();

    this.router.navigate(['/garaje'], { replaceUrl: true });
  }
  volverAlPasillo() {
    this.eventosService.sumarAccion();

    this.router.navigate(['/pasillo'], { replaceUrl: true });
  }
}
