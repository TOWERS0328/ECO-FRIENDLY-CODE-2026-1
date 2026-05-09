import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { ApiResponse } from '../models/dashboard.model';

// ── Interfaces ─────────────────────────────────────────────
export interface UserProfile {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  email: string;
  carrera: string;
  genero: string;
  institution: string;
  registrationDate: string;
  userLevel: number;
  totalReciclajes: number;
  premiosCanjeados: number;
  totalPoints: number;
  materialReciclado: number;
  co2Evitado: number;
  institutionRank: number;
  totalInstitutionUsers: number;
}

export interface HistoryItem {
  id: string;
  type: 'reciclaje' | 'premio';
  title: string;
  status: 'aprobado' | 'pendiente' | 'rechazado';
  date: string;
  details: string[];
  note: string;
  points: number;
}

export interface UserSettings {
  notifications: {
    reciclajeAprobado: boolean;
    nuevosPremios: boolean;
    reporteSemanal: boolean;
    actualizacionesSistema: boolean;
  };
  theme: 'light' | 'dark';
  language: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ── Profile ──────────────────────────────────────────────
  getProfile(): Observable<ApiResponse<UserProfile>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<UserProfile>>(
      `${this.API_URL}/users/profile`,
      { headers }
    );
  }

  updateProfile(profileData: Partial<UserProfile>): Observable<ApiResponse<UserProfile>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<ApiResponse<UserProfile>>(
      `${this.API_URL}/users/profile`,
      profileData,
      { headers }
    );
  }

  // ── History ──────────────────────────────────────────────
  getHistory(): Observable<ApiResponse<HistoryItem[]>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<HistoryItem[]>>(
      `${this.API_URL}/users/history`,
      { headers }
    );
  }

  // ── Settings ─────────────────────────────────────────────
  getSettings(): Observable<ApiResponse<UserSettings>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<ApiResponse<UserSettings>>(
      `${this.API_URL}/users/settings`,
      { headers }
    );
  }

  updateSettings(settings: UserSettings): Observable<ApiResponse<UserSettings>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<ApiResponse<UserSettings>>(
      `${this.API_URL}/users/settings`,
      settings,
      { headers }
    );
  }

  // ── Password ─────────────────────────────────────────────
  changePassword(currentPassword: string, newPassword: string): Observable<ApiResponse<null>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<ApiResponse<null>>(
      `${this.API_URL}/users/change-password`,
      { currentPassword, newPassword },
      { headers }
    );
  }

  // ── Account ──────────────────────────────────────────────
  deleteAccount(): Observable<ApiResponse<null>> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<ApiResponse<null>>(
      `${this.API_URL}/users/account`,
      { headers }
    );
  }
  
}
