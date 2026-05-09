// ══════════════════════════════════════════════════════════
// History Models - EcoFriendly Code
// ══════════════════════════════════════════════════════════

// ── History Item Base ──────────────────────────────────
export interface HistoryItem {
  id: string;
  type: 'reciclaje' | 'premio';
  title: string;
  date: string; // ISO string
  status: 'aprobado' | 'pendiente' | 'rechazado';
  details: string[];
  note: string;
  pointsLabel: string;
  pointsClass: string;
  createdAt: string;
  updatedAt: string;
}

// ── Recycling History Item ────────────────────────────
export interface RecyclingHistoryItem extends HistoryItem {
  type: 'reciclaje';
  materialType: 'plastico' | 'papel' | 'vidrio' | 'metal' | 'organico' | 'electronico';
  materialName: string;
  weight: number;
  weightUnit: string;
  points: number;
  imageUrl?: string;
  validatedBy?: string;
  validatedAt?: string;
  rejectionReason?: string;
}

// ── Reward History Item ────────────────────────────────
export interface RewardHistoryItem extends HistoryItem {
  type: 'premio';
  rewardId: string;
  rewardName: string;
  rewardImage?: string;
  pointsCost: number;
  deliveryStatus?: 'pending' | 'processing' | 'shipped' | 'delivered';
  trackingNumber?: string;
  claimedAt: string;
  deliveredAt?: string;
}

// ── History Filter Options ─────────────────────────────
export interface HistoryFilterOptions {
  type?: 'todas' | 'reciclaje' | 'premio';
  status?: 'todos' | 'aprobado' | 'pendiente' | 'rechazado';
  materialType?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

// ── History Summary ────────────────────────────────────
export interface HistorySummary {
  totalItems: number;
  totalRecyclings: number;
  totalRewards: number;
  approvedCount: number;
  pendingCount: number;
  rejectedCount: number;
  totalPointsEarned: number;
  totalPointsSpent: number;
  history: HistoryItem[];
}

// ── History Statistics ─────────────────────────────────
export interface HistoryStatistics {
  byMaterial: MaterialStatistic[];
  byMonth: MonthlyStatistic[];
  topRecyclings: RecyclingHistoryItem[];
}

export interface MaterialStatistic {
  materialType: string;
  materialName: string;
  count: number;
  totalWeight: number;
  totalPoints: number;
  percentage: number;
}

export interface MonthlyStatistic {
  month: string; // Format: "2024-01"
  monthName: string; // Format: "Enero 2024"
  recyclings: number;
  rewards: number;
  pointsEarned: number;
  pointsSpent: number;
}

// ── API Response wrapper ─────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// ── Paginated Response ─────────────────────────────────
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  message?: string;
  timestamp: string;
}

// ── Filter Tab UI Models (para template) ───────────────
export interface FilterTab {
  key: string;
  label: string;
  icon?: string;
  colorClass?: string;
}

// ── History Detail (para vista detallada) ──────────────
export interface HistoryDetail {
  item: RecyclingHistoryItem | RewardHistoryItem;
  timeline: TimelineEvent[];
  relatedItems?: HistoryItem[];
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'approved' | 'rejected' | 'claimed' | 'delivered';
  title: string;
  description: string;
  date: string;
  icon: string;
  user?: string;
}
