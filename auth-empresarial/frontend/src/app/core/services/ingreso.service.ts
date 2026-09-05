import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrearIngresoRequest, IngresoResponse, SueldoFijoRequest, SueldoFijoResponse } from '../models/ingreso.model';

@Injectable({
  providedIn: 'root'
})
export class IngresoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api'; // Ajusta la URL de tu backend Spring Boot

  // --- TABLA 'ingreso_fijo' ---
  guardarSueldoFijo(data: SueldoFijoRequest): Observable<SueldoFijoResponse> {
    return this.http.post<SueldoFijoResponse>(`${this.apiUrl}/ingreso-fijo`, data);
  }

  obtenerSueldoFijo(): Observable<SueldoFijoResponse> {
    return this.http.get<SueldoFijoResponse>(`${this.apiUrl}/ingreso-fijo`);
  }

  // --- TABLA 'ingresos' (Extra y Variable) ---
  crearIngreso(data: CrearIngresoRequest): Observable<IngresoResponse> {
    return this.http.post<IngresoResponse>(`${this.apiUrl}/ingresos`, data);
  }

  listarIngresos(): Observable<IngresoResponse[]> {
    return this.http.get<IngresoResponse[]>(`${this.apiUrl}/ingresos`);
  }
}