import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventosGlobalesService } from '../services/eventos-globales.service'; 

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {

  // 1. Controles de Visibilidad
  mostrarMenuInspeccion: boolean = false;
  mostrarMapa: boolean = false; // <-- El mapa arranca apagado
  mostrarDescripcion: boolean = false;

  // 2. Variables para textos/ítems (Estructura base, vacía por ahora)
  textoLectura: string = '';
  itemSeleccionado: any = null;
  listaDeObjetosDB: any[] = []; // Si el pasillo tiene objetos, los cargaremos luego
  listaDePuzzlesDB: any[] = []; // Si el pasillo tiene puzzles, los cargaremos luego

  constructor(private router: Router, ) { }

  ngOnInit(): void {
    // Acá llamaríamos a cargar objetos del pasillo si los tuviera
    // this.cargarDatosDelPasillo();
  }

  // --- LÓGICA DE UI ---

  // Lupa de Inspeccionar Objetos
  alternarInspeccion() {
    this.mostrarMenuInspeccion = !this.mostrarMenuInspeccion;
    // Si abrimos la inspección, cerramos el mapa por seguridad
    if (this.mostrarMenuInspeccion) {
      this.mostrarMapa = false;
    }
  }

  // Botón Moverse (Abre el modal del mapa)
  abrirMapa() {
    this.mostrarMapa = true;
    // Cerramos la inspección si estaba abierta para que no se pisen los menús
    this.mostrarMenuInspeccion = false;
  }

  // Megáfono que escucha el mapa para cerrarse
  cerrarMapa() {
    this.mostrarMapa = false;
  }

  // Ver Descripción del ambiente (Por ahora texto harcodeado)
  verDescripcionAmbiente() {
    this.textoLectura = "Es un pasillo largo y estrecho de madera crujiente. Varias puertas cerradas se alinean a los lados, cada una conduciendo a una habitación distinta de la cabaña. El aire está viciado.";
    this.mostrarMenuInspeccion = false;
    this.mostrarDescripcion = true;
  }

  cerrarLectura() {
    this.mostrarDescripcion = false;
  }
}
