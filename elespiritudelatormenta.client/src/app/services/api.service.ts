  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { Observable, of, Subject } from 'rxjs';

  @Injectable({
    providedIn: 'root'
  })
  export class ApiService {

    // URL base para tu servidor .NET
    private baseUrl = 'https://elespiritudelatormenta-net-angular-production.up.railway.app/api';

    private inventarioCambioSource = new Subject<void>();
    inventarioCambio$ = this.inventarioCambioSource.asObservable();

    constructor(private http: HttpClient) { }

    notificarCambioInventario() {
      this.inventarioCambioSource.next();
    }

    // --- NUEVA FUNCIÓN DE LOGIN ---
    iniciarSesion(nombreJugador: string): Observable<any> {
      return this.http.post(`${this.baseUrl}/usuarios/login`, { Nombre: nombreJugador });
    }

    // NUEVA FUNCIÓN MÁGICA: Busca el ID del DNI del navegador
    obtenerIdUsuario(): number {
      const idGuardado = localStorage.getItem('idUsuarioActual');
      return idGuardado ? parseInt(idGuardado, 10) : 0;  // Ya no hace falta el fallback al 1
    }
    getObjetos(habitacionId: number): Observable<any[]> {
      // Le mandamos el ID por la URL a C#
      return this.http.get<any[]>(`${this.baseUrl}/habitaciones/${habitacionId}/objetos?idUsuario=${this.obtenerIdUsuario()}`);
    }

    getPuzzles(habitacionId: number): Observable<any[]> {
      // Le mandamos el ID por la URL a C#
      return this.http.get<any[]>(`${this.baseUrl}/habitaciones/${habitacionId}/puzzles?idUsuario=${this.obtenerIdUsuario()}`);
    }

    guardarEnInventario(idObjeto: number): Observable<any> {
      // Empaquetamos el objeto Y el ID del usuario
      return this.http.post(`${this.baseUrl}/habitaciones/guardar-objeto`, {
        IdObjeto: idObjeto,
        IdUsuario: this.obtenerIdUsuario()
      });
    }

    getInventario(idUsuario: number): Observable<any[]> {
      // Aunque los componentes manden un número acá, nosotros forzamos el uso del real guardado en memoria
      return this.http.get<any[]>(`${this.baseUrl}/usuarios/${this.obtenerIdUsuario()}/inventario`);
    }

    devolverObjeto(idUsuario: number, idObjeto: number): Observable<any> {
      return this.http.delete(`${this.baseUrl}/usuarios/${this.obtenerIdUsuario()}/inventario/${idObjeto}`);
    }

    intentarPuzzle(idPuzzle: number, idsObjetos: number[]): Observable<any> {
      return this.http.post(`${this.baseUrl}/puzzles/${idPuzzle}/intentar`, {
        idsFusibles: idsObjetos,
        IdUsuario: this.obtenerIdUsuario()
      });
    }

    intentarCaja(idPuzzle: number, digitos: number[], esUltimoIntento: boolean): Observable<any> {
      return this.http.post(`${this.baseUrl}/puzzles/${idPuzzle}/intentar-caja?esUltimoIntento=${esUltimoIntento}`, {
        digitos,
        IdUsuario: this.obtenerIdUsuario()
      });
    }

    intentarLlave(idPuzzle: number, idObjeto: number): Observable<any> {
      return this.http.post(`${this.baseUrl}/puzzles/${idPuzzle}/intentar-llave`, {
        IdObjeto: idObjeto,
        IdUsuario: this.obtenerIdUsuario()
      });
    }

    getEstadoCamioneta(idUsuario: number): Observable<any> {
      return this.http.get<any>(`${this.baseUrl}/puzzles/camioneta/estado/${this.obtenerIdUsuario()}`);
    }

    intentarRepararCamioneta(idObjeto: number): Observable<any> {
      return this.http.post<any>(`${this.baseUrl}/puzzles/camioneta/intentar-reparar`, {
        IdObjeto: idObjeto,
        IdUsuario: this.obtenerIdUsuario()
      });
    }

    postIntentoSotano(id: number, nombres: string[]) {
      return this.http.post(`${this.baseUrl}/puzzles/${id}/intentar-sotano`, {
        Nombres: nombres,
        IdUsuario: this.obtenerIdUsuario()
      });
    }

    getMovimientos(idUsuario: number): Observable<any> { // <-- Agregamos : Observable<any>
      const id = this.obtenerIdUsuario();
      if (id === 0) return of(0);
      return this.http.get<number>(`${this.baseUrl}/habitaciones/${id}/movimientos`);
    }

    actualizarMovimientos(idUsuario: number, nuevosMovimientos: number): Observable<any> { // <-- Agregamos : Observable<any>
      const id = this.obtenerIdUsuario();
      if (id === 0) return of(null);
      return this.http.put(`${this.baseUrl}/habitaciones/${id}/movimientos`, nuevosMovimientos);
    }

    // NUEVA FUNCIÓN: Borrar la partida completa
    borrarPartidaActual(): Observable<any> {
      const id = this.obtenerIdUsuario();
      return this.http.delete(`${this.baseUrl}/usuarios/borrar-partida/${id}`);
    }

  }
