import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL base para tu servidor .NET
  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  // Esta es la función que te falta o tiene un nombre distinto
  getObjetos(habitacionId: number): Observable<any[]> {
    // Cambiamos la ruta para que coincida con el controlador de Habitaciones
    return this.http.get<any[]>(`${this.baseUrl}/habitaciones/${habitacionId}/objetos`);
  }
}
