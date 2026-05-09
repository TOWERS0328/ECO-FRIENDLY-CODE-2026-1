// ══════════════════════════════════════════════════════════
// Recycle Models - EcoFriendly Code
// ══════════════════════════════════════════════════════════

import { ApiResponse } from './dashboard.model';
export { ApiResponse };

// ── Material disponible ──────────────────────────────────
export interface Material {
  id: string;
  name: string;
  category: string;
  categoryClass: string;      // Para clases CSS: 'plastico', 'papel', etc.
  description: string;
  points: number;             // pts/kg
  image: string;
  available: boolean;
}

// ── Item en la canasta ───────────────────────────────────
export interface CanastaItem extends Material {
  weight: number;
}

// ── Item para enviar al backend ──────────────────────────
export interface RecyclingSubmissionItem {
  materialId: string;
  weight: number;
}

// ── Solicitud de registro ────────────────────────────────
export interface RecyclingSubmission {
  items: RecyclingSubmissionItem[];
  totalEstimatedPoints: number;
}

// ── Respuesta del registro ───────────────────────────────
export interface RecyclingResponse {
  submissionId: string;
  status: 'submitted' | 'approved' | 'rejected';
  message: string;
  pointsEarned: number;
  submissionDate: string;
}
