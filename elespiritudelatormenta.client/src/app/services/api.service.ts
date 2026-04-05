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

  intentarPuzzle(idPuzzle: number, idsObjetos: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/puzzles/${idPuzzle}/intentar`, { idsFusibles: idsObjetos });
  }

  // --- NUEVA FUNCIÓN PARA LA CAJA FUERTE ---
  intentarCaja(idPuzzle: number, digitosIngresados: number[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/puzzles/${idPuzzle}/intentar-caja`, { Digitos: digitosIngresados });
  }

  intentarLlave(idPuzzle: number, idObjeto: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/puzzles/${idPuzzle}/intentar-llave`, { IdObjeto: idObjeto });
  }

  // --- PUZZLE CAMIONETA ---

  // Obtiene la falla asignada (o la genera si es la primera vez)
  getEstadoCamioneta(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/puzzles/camioneta/estado/${idUsuario}`);
  }

  // Intenta reparar con uno de los 3 objetos (1012, 1013 o 1014)
  intentarRepararCamioneta(idObjeto: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/puzzles/camioneta/intentar-reparar`, { IdObjeto: idObjeto });
  }


  postIntentoSotano(id: number, nombres: string[]) {
    return this.http.post(`${this.baseUrl}/puzzles/${id}/intentar-sotano`, { Nombres: nombres });
  }

  // Obtener los movimientos actuales del usuario
  getMovimientos(idUsuario: number) {
    return this.http.get<number>(`${this.baseUrl}/habitaciones/${idUsuario}/movimientos`);
  }

  // Actualizar los movimientos en la base de datos
  actualizarMovimientos(idUsuario: number, nuevosMovimientos: number) {
    return this.http.put(`${this.baseUrl}/habitaciones/${idUsuario}/movimientos`, nuevosMovimientos);
  }

}
