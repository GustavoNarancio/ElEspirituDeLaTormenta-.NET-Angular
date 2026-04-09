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
  mostrarMiniMenu: boolean = false;
  mostrarDescripcion: boolean = true;
  puzzleResuelto: boolean = false;

  textoLectura: string = 'Esta debe ser la puerta del garaje. La puerta está cerrada con llave, no veo otra forma de entrar ni de abrirla.';
  itemSeleccionado: any = null;
  inventarioUsuario: any[] = [];

  readonly ID_LLAVE_GARAJE = 19;
  readonly ID_PUZZLE_PUERTA = 3;

  constructor(private router: Router, private apiService: ApiService, private eventosService: EventosGlobalesService) { }

  ngOnInit(): void {
    this.cargarInventario();
  }

  cargarInventario() {
    // --- NUEVO: Leemos el ID exacto de tu login ---
    const usuarioStorage = localStorage.getItem('idUsuarioActual');
    const idUsuarioActual = usuarioStorage ? parseInt(usuarioStorage, 10) : 1;

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
    this.apiService.intentarLlave(this.ID_PUZZLE_PUERTA, this.itemSeleccionado.id).subscribe({
      next: (res) => {
        this.textoLectura = res.mensaje;
        this.puzzleResuelto = true;
        this.mostrarMiniMenu = false;
        this.mostrarDescripcion = true;
      },
      error: (err) => {
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
