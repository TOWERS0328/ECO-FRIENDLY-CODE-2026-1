import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import {
  SystemStats,
  MonthlyTrend,
  TopStudent,
  WasteByCategory,
  MetricCard,
  StatsFilter,
  ReportConfig
} from '../models/adminStatistics.model';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() {}

  // ─── Mock data ─────────────────────────────────────────────────────────────
  // TODO: Replace each method body with HttpClient when API is ready.
  // Base URL example: private readonly API = `${environment.apiUrl}/admin/statistics`;

  // TODO: GET ${API}?year=${filter.year}&month=${filter.month}
  getStats(filter?: StatsFilter): Observable<SystemStats> {
    const stats: SystemStats = {
      activeStudents: 487,
      totalRecycled: 2220,
      redeemedRewards: 1245,
      totalStudents: 3850,
      monthlyTrend: this.buildMonthlyTrend(filter?.year ?? 2026),
      topStudents: this.buildTopStudents(),
      wasteByCategory: this.buildWasteByCategory()
    };
    return of(stats).pipe(delay(800));
  }

  // TODO: GET ${API}/cards?year=${year}
  getMetricCards(): MetricCard[] {
    return [
      {
        icon: 'people-outline',
        title: 'Active Students',
        value: 487,
        subtitle: 'This month',
        change: 8,
        iconColor: '#3b82f6',
        bgColor: '#dbeafe'
      },
      {
        icon: 'leaf-outline',
        title: 'Total Recycled',
        value: '2,220 kg',
        subtitle: 'Accumulated',
        change: 12,
        iconColor: '#10b981',
        bgColor: '#d1fae5'
      },
      {
        icon: 'gift-outline',
        title: 'Redeemed Rewards',
        value: 1245,
        subtitle: 'This year',
        change: -3,
        iconColor: '#a855f7',
        bgColor: '#f3e8ff'
      },
      {
        icon: 'school-outline',
        title: 'Total Students',
        value: 3850,
        subtitle: 'Registered',
        change: 5,
        iconColor: '#06b6d4',
        bgColor: '#cffafe'
      }
    ];
  }

  // TODO: GET ${API}/trend?year=${year}
  getTrendChartData(year: number = 2026): Observable<any> {
    const trend = this.buildMonthlyTrend(year);
    return of({
      labels: trend.map(t => t.month),
      datasets: [
        {
          label: 'Recycled Kg',
          data: trend.map(t => t.recycledKg),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.08)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#10b981',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        },
        {
          label: 'Active Students',
          data: trend.map(t => t.activeStudents),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59,130,246,0.08)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#3b82f6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    }).pipe(delay(300));
  }

  // TODO: GET ${API}/categories?year=${year}&month=${month}
  getCategoryChartData(): Observable<any> {
    const cats = this.buildWasteByCategory();
    return of({
      labels: cats.map(c => c.category),
      datasets: [{
        data: cats.map(c => c.percentage),
        backgroundColor: cats.map(c => c.color),
        borderWidth: 0,
        hoverOffset: 12
      }]
    }).pipe(delay(300));
  }

  // TODO: GET ${API}/growth?year=${year}
  getGrowthChartData(year: number = 2026): Observable<any> {
    const trend = this.buildMonthlyTrend(year);
    return of({
      labels: trend.map(t => t.month),
      datasets: [{
        label: 'Monthly Growth %',
        data: trend.map(t => t.growth),
        backgroundColor: trend.map(t => t.growth >= 0 ? 'rgba(16,185,129,0.7)' : 'rgba(239,68,68,0.7)'),
        borderColor: trend.map(t => t.growth >= 0 ? '#10b981' : '#ef4444'),
        borderWidth: 1.5,
        borderRadius: 6
      }]
    }).pipe(delay(300));
  }

  // TODO: GET ${API}/heatmap?year=${year}
  getHeatmapData(year: number = 2026): Observable<any> {
    const months = this.buildMonthlyTrend(year);
    const cats = this.buildWasteByCategory();
    // Simulates kg breakdown per category per month
    const data: number[][] = months.map(m =>
      cats.map(c => +(m.recycledKg * (c.percentage / 100)).toFixed(1))
    );
    return of({ months: months.map(m => m.month), categories: cats.map(c => c.category), data })
      .pipe(delay(300));
  }

  // ─── Export helpers ─────────────────────────────────────────────────────────
  // TODO: POST ${API}/export — backend should return a signed S3 URL or blob

  /**
   * Triggers CSV/Excel export. In production replace with:
   *   return this.http.post(`${API}/export`, config, { responseType: 'blob' });
   */
  exportToExcel(config: ReportConfig): void {
    // Client-side CSV fallback until API is ready
    const rows: string[][] = [
      ['Month', 'Recycled Kg', 'Active Students', 'Growth %']
    ];
    this.buildMonthlyTrend(config.filter.year).forEach(t => {
      rows.push([t.month, String(t.recycledKg), String(t.activeStudents), String(t.growth)]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recycling-report-${config.filter.year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Triggers PDF export. In production replace with:
   *   return this.http.post(`${API}/export/pdf`, config, { responseType: 'blob' });
   */
  exportToPdf(config: ReportConfig): void {
    // Print-to-PDF fallback until API is ready
    window.print();
  }

  // ─── Available years helper ─────────────────────────────────────────────────
  getAvailableYears(): number[] {
    const current = new Date().getFullYear();
    return [current - 2, current - 1, current];
  }

  // ─── Private mock builders ──────────────────────────────────────────────────

  private buildMonthlyTrend(year: number): MonthlyTrend[] {
    const months = [
      { label: 'Jan', kg: 650, students: 65 },
      { label: 'Feb', kg: 720, students: 82 },
      { label: 'Mar', kg: 850, students: 105 },
      { label: 'Apr', kg: 790, students: 98 },
      { label: 'May', kg: 930, students: 120 },
      { label: 'Jun', kg: 870, students: 112 },
      { label: 'Jul', kg: 1020, students: 135 },
      { label: 'Aug', kg: 960, students: 128 },
      { label: 'Sep', kg: 1100, students: 148 },
      { label: 'Oct', kg: 1050, students: 142 },
      { label: 'Nov', kg: 1200, students: 160 },
      { label: 'Dec', kg: 1150, students: 155 }
    ];
    return months.map((m, i) => ({
      month: `${m.label} ${year}`,
      date: `${year}-${String(i + 1).padStart(2, '0')}`,
      recycledKg: m.kg,
      activeStudents: m.students,
      growth: i === 0 ? 0 : +((( m.kg - months[i - 1].kg) / months[i - 1].kg) * 100).toFixed(1)
    }));
  }

  private buildTopStudents(): TopStudent[] {
    return [
      { id: 1, name: 'María García',  avatar: '', recyclingPoints: 1280, recycledKg: 45.5, position: 1 },
      { id: 2, name: 'Juan Pérez',    avatar: '', recyclingPoints: 1180, recycledKg: 42.3, position: 2 },
      { id: 3, name: 'Ana López',     avatar: '', recyclingPoints: 1050, recycledKg: 38.7, position: 3 },
      { id: 4, name: 'Carlos Ruiz',   avatar: '', recyclingPoints: 980,  recycledKg: 35.2, position: 4 },
      { id: 5, name: 'Sofía Torres',  avatar: '', recyclingPoints: 920,  recycledKg: 33.8, position: 5 }
    ];
  }

  private buildWasteByCategory(): WasteByCategory[] {
    return [
      { category: 'Plastic', percentage: 38, amount: 323,   color: '#10b981' },
      { category: 'Paper',   percentage: 33, amount: 280.5, color: '#3b82f6' },
      { category: 'Glass',   percentage: 18, amount: 153,   color: '#a855f7' },
      { category: 'Metal',   percentage: 11, amount: 93.5,  color: '#f59e0b' }
    ];
  }
}