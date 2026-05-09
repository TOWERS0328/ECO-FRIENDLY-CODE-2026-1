// ══════════════════════════════════════════════════════════
// Configuration Service - EcoFriendly Code
// ══════════════════════════════════════════════════════════

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import {
  ApiResponse,
  ConfigurationSummary,
  UserSettings,
  UpdateSettingsRequest,
  UserProfile,
  ChangePasswordRequest,
  DeleteAccountRequest,
  NotificationPreferences
} from '../models/configuration.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ── Headers con autenticación ────────────────────────
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // ══════════════════════════════════════════════════════════
  // GET - Obtener configuración completa
  // ══════════════════════════════════════════════════════════
  getConfigurationSummary(): Observable<ApiResponse<ConfigurationSummary>> {
    return this.http.get<ApiResponse<ConfigurationSummary>>(
      `${this.API_URL}/configuration/summary`,
      { headers: this.getHeaders() }
    );
  }

  // ══════════════════════════════════════════════════════════
  // GET - Obtener solo settings del usuario
  // ══════════════════════════════════════════════════════════
  getUserSettings(): Observable<ApiResponse<UserSettings>> {
    return this.http.get<ApiResponse<UserSettings>>(
      `${this.API_URL}/configuration/settings`,
      { headers: this.getHeaders() }
    );
  }

  // ══════════════════════════════════════════════════════════
  // PUT - Actualizar settings generales
  // ══════════════════════════════════════════════════════════
  updateSettings(settings: UpdateSettingsRequest): Observable<ApiResponse<UserSettings>> {
    return this.http.put<ApiResponse<UserSettings>>(
      `${this.API_URL}/configuration/settings`,
      settings,
      { headers: this.getHeaders() }
    );
  }

  // ══════════════════════════════════════════════════════════
  // PUT - Actualizar solo notificaciones
  // ══════════════════════════════════════════════════════════
  updateNotificationSettings(notifications: Partial<NotificationPreferences>): Observable<ApiResponse<NotificationPreferences>> {
    return this.http.put<ApiResponse<NotificationPreferences>>(
      `${this.API_URL}/configuration/notifications`,
      notifications,
      { headers: this.getHeaders() }
    );
  }

  // ══════════════════════════════════════════════════════════
  // GET - Obtener perfil del usuario
  // ══════════════════════════════════════════════════════════
  getUserProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(
      `${this.API_URL}/configuration/profile`,
      { headers: this.getHeaders() }
    );
  }

  // ══════════════════════════════════════════════════════════
  // PUT - Actualizar perfil del usuario
  // ══════════════════════════════════════════════════════════
  updateUserProfile(profile: Partial<UserProfile>): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(
      `${this.API_URL}/configuration/profile`,
      profile,
      { headers: this.getHeaders() }
    );
  }

  // ══════════════════════════════════════════════════════════
  // POST - Cambiar contraseña
  // ══════════════════════════════════════════════════════════
  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<{ success: boolean }>> {
    return this.http.post<ApiResponse<{ success: boolean }>>(
      `${this.API_URL}/configuration/change-password`,
      request,
      { headers: this.getHeaders() }
    );
  }

  // ══════════════════════════════════════════════════════════
  // POST - Subir foto de perfil
  // ══════════════════════════════════════════════════════════
  uploadProfileImage(file: File): Observable<ApiResponse<{ imageUrl: string }>> {
    const formData = new FormData();
    formData.append('image', file);

    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // No incluir Content-Type para que el navegador lo configure automáticamente con boundary
    });

    return this.http.post<ApiResponse<{ imageUrl: string }>>(
      `${this.API_URL}/configuration/upload-image`,
      formData,
      { headers }
    );
  }

  // ══════════════════════════════════════════════════════════
  // DELETE - Eliminar cuenta
  // ══════════════════════════════════════════════════════════
  deleteAccount(request: DeleteAccountRequest): Observable<ApiResponse<{ success: boolean }>> {
    return this.http.request<ApiResponse<{ success: boolean }>>(
      'DELETE',
      `${this.API_URL}/configuration/delete-account`,
      {
        headers: this.getHeaders(),
        body: request
      }
    );
  }

  // ══════════════════════════════════════════════════════════
  // PUT - Cambiar tema
  // ══════════════════════════════════════════════════════════
  updateTheme(theme: 'light' | 'dark'): Observable<ApiResponse<UserSettings>> {
    return this.updateSettings({ theme });
  }

  // ══════════════════════════════════════════════════════════
  // PUT - Cambiar idioma
  // ══════════════════════════════════════════════════════════
  updateLanguage(language: string): Observable<ApiResponse<UserSettings>> {
    return this.updateSettings({ language });
  }
}
