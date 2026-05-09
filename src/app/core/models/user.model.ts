// ══════════════════════════════════════════════════════════
// User Models - EcoFriendly Code
// ══════════════════════════════════════════════════════════

// ── Perfil de Usuario ──────────────────────────────────
export interface UserProfile {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  cedula: string;           // Código de estudiante
  institution: string;
  registrationDate: string; // ISO string
  avatarUrl?: string;

  // ── Estadísticas ───────────────────────────────────────
  userLevel: number;
  totalReciclajes: number;
  premiosCanjeados: number;
  totalPoints: number;
  materialReciclado: number; // kg
  co2Evitado: number;        // kg

  // ── Ranking ────────────────────────────────────────────
  institutionRank: number;
  totalInstitutionUsers: number;
}

// ── Respuesta API ──────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// ── Datos para editar perfil ───────────────────────────
export interface UpdateProfileRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  institution?: string;
}

// ── Cambio de contraseña ───────────────────────────────
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
