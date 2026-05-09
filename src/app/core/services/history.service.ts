// ══════════════════════════════════════════════════════════
// History Service - EcoFriendly Code
// ══════════════════════════════════════════════════════════

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import {
  ApiResponse,
  PaginatedResponse,
  HistoryItem,
  HistorySummary,
  HistoryFilterOptions,
  HistoryStatistics,
  HistoryDetail,
  RecyclingHistoryItem,
  RewardHistoryItem
} from '../models/history.model';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

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
  // GET - Obtener historial completo con resumen
  // ══════════════════════════════════════════════════════════
  getHistorySummary(filters?: HistoryFilterOptions): Observable<ApiResponse<HistorySummary>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.type && filters.type !== 'todas') {
        params = params.set('type', filters.type);
      }
      if (filters.status && filters.status !== 'todos') {
        params = params.set('status', filters.status);
      }
      if (filters.materialType) {
        params = params.set('materialType', filters.materialType);
      }
      if (filters.dateFrom) {
        params = params.set('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params = params.set('dateTo', filters.dateTo);
      }
      if (filters.limit) {
        params = params.set('limit', filters.limit.toString());
      }
      if (filters.offset) {
        params = params.set('offset', filters.offset.toString());
      }
    }

    return this.http.get<ApiResponse<HistorySummary>>(
      `${this.API_URL}/history/summary`,
      { headers: this.getHeaders(), params }
    );
  }

  // ══════════════════════════════════════════════════════════
  // GET - Obtener solo lista de items (paginado)
  // ══════════════════════════════════════════════════════════
  getHistory(filters?: HistoryFilterOptions): Observable<PaginatedResponse<HistoryItem>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.type && filters.type !== 'todas') {
        params = params.set('type', filters.type);
      }
      if (filters.status && filters.status !== 'todos') {
        params = params.set('status', filters.status);
      }
      if (filters.materialType) {
        params = params.set('materialType', filters.materialType);
      }
      if (filters.dateFrom) {
        params = params.set('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params = params.set('dateTo', filters.dateTo);
      }
      if (filters.limit) {
        params = params.set('limit', filters.limit.toString());
      }
      if (filters.offset) {
        params = params.set('offset', filters.offset.toString());
      }
    }

    return this.http.get<PaginatedResponse<HistoryItem>>(
      `${this.API_URL}/history`,
      { headers: this.getHeaders(), params }
    );
  }

  // ══════════════════════════════════════════════════════════
  // GET - Obtener solo reciclajes
  // ══════════════════════════════════════════════════════════
  getRecyclingHistory(filters?: HistoryFilterOptions): Observable<PaginatedResponse<RecyclingHistoryItem>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status && filters.status !== 'todos') {
        params = params.set('status', filters.status);
      }
      if (filters.materialType) {
        params = params.set('materialType', filters.materialType);
      }
      if (filters.dateFrom) {
        params = params.set('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params = params.set('dateTo', filters.dateTo);
      }
      if (filters.limit) {
        params = params.set('limit', filters.limit.toString());
      }
      if (filters.offset) {
        params = params.set('offset', filters.offset.toString());
      }
    }

    return this.http.get<PaginatedResponse<RecyclingHistoryItem>>(
      `${this.API_URL}/history/recyclings`,
      { headers: this.getHeaders(), params }
    );
  }

  // ══════════════════════════════════════════════════════════
  // GET - Obtener solo premios canjeados
  // ══════════════════════════════════════════════════════════
  getRewardsHistory(filters?: HistoryFilterOptions): Observable<PaginatedResponse<RewardHistoryItem>> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status && filters.status !== 'todos') {
        params = params.set('status', filters.status);
      }
      if (filters.dateFrom) {
        params = params.set('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params = params.set('dateTo', filters.dateTo);
      }
      if (filters.limit) {
        params = params.set('limit', filters.limit.toString());
      }
      if (filters.offset) {
        params = params.set('offset', filters.offset.toString());
      }
    }

    return this.http.get<PaginatedResponse<RewardHistoryItem>>(
      `${this.API_URL}/history/rewards`,
      { headers: this.getHeaders(), params }
    );
  }

  // ══════════════════════════════════════════════════════════
  // GET - Obtener detalle de un item específico
  // ══════════════════════════════════════════════════════════
  getHistoryDetail(itemId: string): Observable<ApiResponse<HistoryDetail>> {
    return this.http.get<ApiResponse<HistoryDetail>>(
      `${this.API_URL}/history/${itemId}`,
      { headers: this.getHeaders() }
    );
  }

  // ══════════════════════════════════════════════════════════
  // GET - Obtener estadísticas del historial
  // ══════════════════════════════════════════════════════════
  getHistoryStatistics(dateFrom?: string, dateTo?: string): Observable<ApiResponse<HistoryStatistics>> {
    let params = new HttpParams();

    if (dateFrom) {
      params = params.set('dateFrom', dateFrom);
    }
    if (dateTo) {
      params = params.set('dateTo', dateTo);
    }

    return this.http.get<ApiResponse<HistoryStatistics>>(
      `${this.API_URL}/history/statistics`,
      { headers: this.getHeaders(), params }
    );
  }

  // ══════════════════════════════════════════════════════════
  // DELETE - Eliminar un item del historial (si está permitido)
  // ══════════════════════════════════════════════════════════
  deleteHistoryItem(itemId: string): Observable<ApiResponse<{ success: boolean }>> {
    return this.http.delete<ApiResponse<{ success: boolean }>>(
      `${this.API_URL}/history/${itemId}`,
      { headers: this.getHeaders() }
    );
  }

  // ══════════════════════════════════════════════════════════
  // POST - Exportar historial (CSV/PDF)
  // ══════════════════════════════════════════════════════════
  exportHistory(format: 'csv' | 'pdf', filters?: HistoryFilterOptions): Observable<Blob> {
    let params = new HttpParams();
    params = params.set('format', format);

    if (filters) {
      if (filters.type && filters.type !== 'todas') {
        params = params.set('type', filters.type);
      }
      if (filters.status && filters.status !== 'todos') {
        params = params.set('status', filters.status);
      }
      if (filters.dateFrom) {
        params = params.set('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params = params.set('dateTo', filters.dateTo);
      }
    }

    return this.http.get(
      `${this.API_URL}/history/export`,
      {
        headers: this.getHeaders(),
        params,
        responseType: 'blob'
      }
    );
  }

  // ══════════════════════════════════════════════════════════
  // Helper - Descargar archivo exportado
  // ══════════════════════════════════════════════════════════
  downloadExportedFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
