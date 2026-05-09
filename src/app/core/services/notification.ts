import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/dashboard.model';

// ── Interfaces ─────────────────────────────────────────────
export interface NotificationItem {
  id: string;
  type: 'reciclaje' | 'premio' | 'sistema' | 'reporte';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

export interface NotificationSettings {
  reciclajeAprobado: boolean;
  nuevosPremios: boolean;
  reporteSemanal: boolean;
  actualizacionesSistema: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ── Notifications ────────────────────────────────────────
  getNotifications(): Observable<ApiResponse<NotificationItem[]>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<NotificationItem[]>>(
      `${this.API_URL}/notifications/list`,
      { headers }
    );
  }

  markAsRead(notificationId: string): Observable<ApiResponse<null>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<ApiResponse<null>>(
      `${this.API_URL}/notifications/${notificationId}/read`,
      {},
      { headers }
    );
  }

  markAllAsRead(): Observable<ApiResponse<null>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<ApiResponse<null>>(
      `${this.API_URL}/notifications/mark-all-read`,
      {},
      { headers }
    );
  }

  // ── Settings ─────────────────────────────────────────────
  getNotificationSettings(): Observable<ApiResponse<NotificationSettings>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<NotificationSettings>>(
      `${this.API_URL}/notifications/settings`,
      { headers }
    );
  }

  updateNotificationSettings(settings: NotificationSettings): Observable<ApiResponse<NotificationSettings>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<ApiResponse<NotificationSettings>>(
      `${this.API_URL}/notifications/settings`,
      settings,
      { headers }
    );
  }
}
