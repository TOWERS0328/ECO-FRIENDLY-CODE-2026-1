// ══════════════════════════════════════════════════════════
// Rewards Models - EcoFriendly Code
// ══════════════════════════════════════════════════════════

import { ApiResponse } from './dashboard.model';
export { ApiResponse };

// ── Premio / Reward ──────────────────────────────────────
export interface Reward {
  id: string;
  name: string;
  description: string;
  category: string;
  points: number;
  stock: number;
  image: string;
  available: boolean;
}

// ── Carrito Item ─────────────────────────────────────────
export interface CartItem {
  rewardId: string;
  quantity: number;
}

// ── Solicitud de canje ─────────────────────────────────
export interface RedemptionRequest {
  rewards: CartItem[];
  totalPoints: number;
}

// ── Respuesta de canje ───────────────────────────────────
export interface RedemptionResponse {
  redemptionId: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  remainingPoints: number;
  redeemedAt: string;
}

// ── Puntos del usuario ─────────────────────────────────
export interface UserPoints {
  availablePoints: number;
  totalEarned: number;
  totalSpent: number;
}
