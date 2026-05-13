import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardStats,
  ActividadReciente,
  SolicitudReciclaje,
  Alerta
} from '../models/adminDashboard.models';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private apiUrl = `${environment.apiUrl}/admin/dashboard`;

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }

  getActividadReciente(): Observable<ActividadReciente[]> {
    return this.http.get<ActividadReciente[]>(`${this.apiUrl}/actividad`);
  }

  getSolicitudesPendientes(): Observable<SolicitudReciclaje[]> {
    return this.http.get<SolicitudReciclaje[]>(`${this.apiUrl}/solicitudes-pendientes`);
  }

  getAlertas(): Observable<Alerta[]> {
    return this.http.get<Alerta[]>(`${this.apiUrl}/alertas`);
  }

  aprobarSolicitud(id: string, comentario?: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/solicitudes/${id}/aprobar`, { comentario });
  }

  rechazarSolicitud(id: string, comentario?: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/solicitudes/${id}/rechazar`, { comentario });
  }
}
