// ── Stats Card ─────────────────────────────────────────
export interface StatCard {
  id: string;
  value: number;
  label: string;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: string;
  color: 'green' | 'blue' | 'orange' | 'teal';
  unit?: string;
}

// ── Recent Activity ──────────────────────────────────
export interface RecentActivity {
  id: string;
  material: string;
  materialType: 'plastico' | 'papel' | 'vidrio' | 'metal' | 'organico' | 'electronico';
  weight: number;
  weightUnit: string;
  date: string; // ISO string
  points: number;
  status: 'approved' | 'pending' | 'rejected';
  imageUrl?: string;
}

// ── Environmental Impact ───────────────────────────────
export interface EnvironmentalImpact {
  material: string;
  amount: number;
  unit: string;
  percentage: number;
  color: string;
}

// ── Dashboard Summary ──────────────────────────────────
export interface DashboardSummary {
  userName: string;
  userLevel: number;
  institutionRank: number;
  totalInstitutionUsers: number;
  stats: StatCard[];
  recentActivity: RecentActivity[];
  environmentalImpact: EnvironmentalImpact[];
}

// ── API Response wrapper ─────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}
