// ══════════════════════════════════════════════════════════
// Rewards Service - EcoFriendly Code
// ══════════════════════════════════════════════════════════

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { ApiResponse, Reward, RedemptionRequest, RedemptionResponse, UserPoints } from '../models/rewards.model';

@Injectable({
  providedIn: 'root'
})
export class RewardsService {

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
  // GET - Premios disponibles
  // ══════════════════════════════════════════════════════════
  getAvailableRewards(): Observable<ApiResponse<Reward[]>> {
    // 🔴 MODO REAL: Descomenta cuando la API esté lista
    // return this.http.get<ApiResponse<Reward[]>>(
    //   `${this.API_URL}/rewards`,
    //   { headers: this.getHeaders() }
    // );

    // 🟢 MODO MOCK
    return this.getMockRewards();
  }

  // ══════════════════════════════════════════════════════════
  // GET - Puntos del usuario
  // ══════════════════════════════════════════════════════════
  getUserPoints(): Observable<ApiResponse<UserPoints>> {
    // 🔴 MODO REAL
    // return this.http.get<ApiResponse<UserPoints>>(
    //   `${this.API_URL}/users/points`,
    //   { headers: this.getHeaders() }
    // );

    // 🟢 MODO MOCK
    return this.getMockPoints();
  }

  // ══════════════════════════════════════════════════════════
  // POST - Canjear premios
  // ══════════════════════════════════════════════════════════
  redeemRewards(request: RedemptionRequest): Observable<ApiResponse<RedemptionResponse>> {
    // 🔴 MODO REAL
    // return this.http.post<ApiResponse<RedemptionResponse>>(
    //   `${this.API_URL}/rewards/redeem`,
    //   request,
    //   { headers: this.getHeaders() }
    // );

    // 🟢 MODO MOCK
    return this.mockRedeem(request);
  }

  // ══════════════════════════════════════════════════════════
  // MOCK - Datos de prueba
  // ══════════════════════════════════════════════════════════
  private getMockRewards(): Observable<ApiResponse<Reward[]>> {
    const mockRewards: Reward[] = [
      {
        id: 'r1',
        name: 'Bolsa Ecológica Reutilizable',
        description: 'Bolsa hecha de materiales reciclados, perfecta para tus compras diarias.',
        category: 'Productos',
        points: 150,
        stock: 25,
        image: 'assets/images/rewards/bolsa-eco.jpg',
        available: true
      },
      {
        id: 'r2',
        name: 'Descuento 20% Cafetería',
        description: 'Cupón de descuento para la cafetería del campus universitario.',
        category: 'Cupones',
        points: 200,
        stock: 50,
        image: 'assets/images/rewards/cupon-cafe.jpg',
        available: true
      },
      {
        id: 'r3',
        name: 'Planta Suculenta',
        description: 'Pequeña planta suculenta en maceta biodegradable.',
        category: 'Plantas',
        points: 300,
        stock: 5,
        image: 'assets/images/rewards/suculenta.jpg',
        available: true
      },
      {
        id: 'r4',
        name: 'Cuaderno Reciclado A5',
        description: 'Cuaderno con hojas de papel 100% reciclado y tapa de cartón.',
        category: 'Papelería',
        points: 250,
        stock: 0,
        image: 'assets/images/rewards/cuaderno.jpg',
        available: false
      },
      {
        id: 'r5',
        name: 'Entrada Cine Eco',
        description: 'Entrada para la función especial de cine ambiental.',
        category: 'Entretenimiento',
        points: 400,
        stock: 15,
        image: 'assets/images/rewards/cine.jpg',
        available: true
      },
      {
        id: 'r6',
        name: 'Power Bank Solar',
        description: 'Cargador portátil con panel solar integrado de 10000mAh.',
        category: 'Tecnología',
        points: 1200,
        stock: 3,
        image: 'assets/images/rewards/powerbank.jpg',
        available: true
      }
    ];

    const response: ApiResponse<Reward[]> = {
      success: true,
      data: mockRewards,
      timestamp: new Date().toISOString()
    };

    return of(response).pipe(delay(600));
  }

  private getMockPoints(): Observable<ApiResponse<UserPoints>> {
    const response: ApiResponse<UserPoints> = {
      success: true,
      data: {
        availablePoints: 2840,
        totalEarned: 3500,
        totalSpent: 660
      },
      timestamp: new Date().toISOString()
    };

    return of(response).pipe(delay(400));
  }

  private mockRedeem(request: RedemptionRequest): Observable<ApiResponse<RedemptionResponse>> {
    const response: ApiResponse<RedemptionResponse> = {
      success: true,
      data: {
        redemptionId: 'red-' + Date.now(),
        status: 'pending',
        message: 'Canje registrado exitosamente. Pendiente de aprobación.',
        remainingPoints: 2840 - request.totalPoints,
        redeemedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    };

    return of(response).pipe(delay(1000));
  }
}
