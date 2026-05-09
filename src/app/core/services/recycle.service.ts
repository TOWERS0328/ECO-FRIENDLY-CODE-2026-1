// ══════════════════════════════════════════════════════════
// Recycle Service - EcoFriendly Code
// ══════════════════════════════════════════════════════════

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { ApiResponse, Material, RecyclingSubmission, RecyclingResponse } from '../models/recycle.model';

@Injectable({
  providedIn: 'root'
})
export class RecycleService {

  private readonly API_URL = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ── Headers ──────────────────────────────────────────────
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // ══════════════════════════════════════════════════════════
  // GET - Materiales disponibles
  // ══════════════════════════════════════════════════════════
  getAvailableMaterials(): Observable<ApiResponse<Material[]>> {
    // 🔴 MODO REAL
    // return this.http.get<ApiResponse<Material[]>>(
    //   `${this.API_URL}/recycle/materials`,
    //   { headers: this.getHeaders() }
    // );

    // 🟢 MODO MOCK
    return this.getMockMaterials();
  }

  // ══════════════════════════════════════════════════════════
  // POST - Registrar reciclaje
  // ══════════════════════════════════════════════════════════
  submitRecycling(submission: RecyclingSubmission): Observable<ApiResponse<RecyclingResponse>> {
    // 🔴 MODO REAL
    // return this.http.post<ApiResponse<RecyclingResponse>>(
    //   `${this.API_URL}/recycle/submit`,
    //   submission,
    //   { headers: this.getHeaders() }
    // );

    // 🟢 MODO MOCK
    return this.mockSubmit(submission);
  }

  // ══════════════════════════════════════════════════════════
  // MOCK - Datos de prueba
  // ══════════════════════════════════════════════════════════
  private getMockMaterials(): Observable<ApiResponse<Material[]>> {
    const mockMaterials: Material[] = [
      {
        id: 'm1',
        name: 'Botellas PET',
        category: 'Plástico',
        categoryClass: 'plastico',
        description: 'Botellas de plástico transparente o coloreado. Limpias y sin tapa.',
        points: 50,
        image: 'assets/images/materials/botella-pet.jpg',
        available: true
      },
      {
        id: 'm2',
        name: 'Periódicos y Revistas',
        category: 'Papel',
        categoryClass: 'papel',
        description: 'Papel de periódico, revistas y folletos. Sin plastificar.',
        points: 30,
        image: 'assets/images/materials/papel-periodico.jpg',
        available: true
      },
      {
        id: 'm3',
        name: 'Botellas de Vidrio',
        category: 'Vidrio',
        categoryClass: 'vidrio',
        description: 'Botellas y frascos de vidrio. Sin tapas ni etiquetas.',
        points: 40,
        image: 'assets/images/materials/vidrio-botella.jpg',
        available: true
      },
      {
        id: 'm4',
        name: 'Latas de Aluminio',
        category: 'Metal',
        categoryClass: 'metal',
        description: 'Latas de bebidas y alimentos. Aplastadas preferiblemente.',
        points: 60,
        image: 'assets/images/materials/lata-aluminio.jpg',
        available: true
      },
      {
        id: 'm5',
        name: 'Tetra Pak',
        category: 'Mixto',
        categoryClass: 'mixto',
        description: 'Envases de cartón multicapa. Enjuagados y aplastados.',
        points: 35,
        image: 'assets/images/materials/tetrapak.jpg',
        available: true
      },
      {
        id: 'm6',
        name: 'Bolsas de Plástico',
        category: 'Plástico',
        categoryClass: 'plastico',
        description: 'Bolsas y film plástico limpio. Sin residuos orgánicos.',
        points: 25,
        image: 'assets/images/materials/bolsa-plastico.jpg',
        available: true
      }
    ];

    const response: ApiResponse<Material[]> = {
      success: true,
      data: mockMaterials,
      timestamp: new Date().toISOString()
    };

    return of(response).pipe(delay(500));
  }

  private mockSubmit(submission: RecyclingSubmission): Observable<ApiResponse<RecyclingResponse>> {
    const response: ApiResponse<RecyclingResponse> = {
      success: true,
      data: {
        submissionId: 'sub-' + Date.now(),
        status: 'submitted',
        message: 'Reciclaje registrado exitosamente. Pendiente de validación.',
        pointsEarned: submission.totalEstimatedPoints,
        submissionDate: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };

    return of(response).pipe(delay(800));
  }
}
