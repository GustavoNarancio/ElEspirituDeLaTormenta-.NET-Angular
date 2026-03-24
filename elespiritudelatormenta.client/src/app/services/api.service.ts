import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL base para tu servidor .NET
  private baseUrl = '/api';


  private inventarioCambioSource = new Subject<void>();
  inventarioCambio$ = this.inventarioCambioSource.asObservable();
  constructor(private http: HttpClient) { }

  notificarCambioInventario() {
    this.inventarioCambioSource.next();
  }


  getObjetos(habitacionId: number): Observable<any[]> {
    
    return this.http.get<any[]>(`${this.baseUrl}/habitaciones/${habitacionId}/objetos`);
  }

  getPuzzles(habitacionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/habitaciones/${habitacionId}/puzzles`);
  }


  guardarEnInventario(idObjeto: number): Observable<any> {
    // Enviamos un POST al servidor con el ID del objeto
    return this.http.post(`${this.baseUrl}/habitaciones/guardar-objeto`, { idObjeto });
  }

  getInventario(idUsuario: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/usuarios/${idUsuario}/inventario`);
  }
  devolverObjeto(idUsuario: number, idObjeto: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${idUsuario}/inventario/${idObjeto}`);
  }

}

