export interface SystemStats {
  activeStudents: number;
  totalRecycled: number;
  redeemedRewards: number;
  totalStudents: number;
  monthlyTrend: MonthlyTrend[];
  topStudents: TopStudent[];
  wasteByCategory: WasteByCategory[];
}

export interface MonthlyTrend {
  month: string;       // display label e.g. "Jan 2026"
  date: string;        // ISO year-month e.g. "2026-01"
  recycledKg: number;
  activeStudents: number;
  growth: number;      // % vs previous month
}

export interface TopStudent {
  id: number;
  name: string;
  avatar: string;
  recyclingPoints: number;
  recycledKg: number;
  position: number;
}

export interface WasteByCategory {
  category: string;
  percentage: number;
  amount: number;      // kg
  color: string;
}

export interface MetricCard {
  icon: string;
  title: string;
  value: string | number;
  subtitle: string;
  change: number;      // % positive or negative
  iconColor: string;
  bgColor: string;
}

// ─── Filter / export types ───────────────────────────────────────────────────

export type ExportFormat = 'excel' | 'pdf';

export interface StatsFilter {
  year: number;
  month?: number;      // 1-12, undefined = all months
}

export interface ReportConfig {
  format: ExportFormat;
  filter: StatsFilter;
  sections: ReportSection[];
}

export type ReportSection =
  | 'metrics'
  | 'monthly-trend'
  | 'top-students'
  | 'waste-categories';