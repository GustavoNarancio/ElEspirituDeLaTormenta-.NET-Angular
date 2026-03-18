import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-lavadero',
  templateUrl: './lavadero.component.html',
  styleUrls: ['./lavadero.component.css']
})
export class LavaderoComponent implements OnInit {

  // 1. El interruptor para mostrar/ocultar el cuadro rectangular de abajo
  mostrarMenuInspeccion: boolean = false;
  objetoSeleccionado: any = null;

  // 2. Aquí guardaremos los objetos cuando los traigamos de la DB (por ahora vacío)
  listaDeObjetosDB: any[] = [];

  constructor(private router: Router, private apiService: ApiService) { }

  ngOnInit(): void {
    console.log('Iniciando carga del Lavadero...');
    this.cargarObjetosDelLavadero();
    // Por ahora lo dejamos vacío para que no tire errores
  }

  // 3. La función que cambia de true a false para abrir el menú
  alternarInspeccion() {
    this.mostrarMenuInspeccion = !this.mostrarMenuInspeccion;

    // Si abrimos el menú y la lista está vacía, traemos los datos
    if (this.mostrarMenuInspeccion) {
      this.cargarObjetosDelLavadero();
    }
  }

  cargarObjetosDelLavadero() {
    // Llamamos al servicio (ID 1 = Lavadero)
    this.apiService.getObjetos(1).subscribe({
      next: (datos: any[]) => {
        console.log('¡Datos recibidos con éxito!', datos);
        this.listaDeObjetosDB = datos;
      },
      error: (err: any) => {
        console.error('ERROR de red o servidor:', err);
      }
    });
  }


  seleccionarObjeto(obj: any) {
    this.objetoSeleccionado = obj;
    console.log('Tocaste el objeto:', obj.nombre);

    // Aquí es donde después haremos que aparezca el mini-cuadro cuadrado
  }
  // Función para volver al pasillo
  volver() {
    this.router.navigate(['/juego']);
  }
}
