import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  cedula: string;
  nombre: string;
  apellido: string;
  genero: string;
  email: string;
  carrera: string;
  password: string;
}

export interface UserDto {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  rol: string;
}

export interface LoginResponse {
  token: string;
  user: UserDto;
}

export interface ApiResponse<T> {
  success: boolean;
  timestamp: string;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Login ───────────────────────────────────────────
  login(email: string, password: string): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.API_URL}/auth/login`,
      { email, password } as LoginRequest
    ).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.saveToken(response.data.token);
          this.saveUser(response.data.user);
        }
      })
    );
  }

  // ── Register ────────────────────────────────────────
  register(request: RegisterRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${this.API_URL}/auth/register`,
      request
    );
  }

  // ── Logout ────────────────────────────────────────
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // ── Helpers ───────────────────────────────────────
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  saveUser(user: UserDto): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser(): UserDto | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUser();
  }
}
