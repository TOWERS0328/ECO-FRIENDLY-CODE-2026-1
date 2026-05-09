import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DashboardService } from '../../../core/services/dashboard.service';
import { DashboardSummary, StatCard, RecentActivity, EnvironmentalImpact } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit, OnDestroy {

  // ── Estado ───────────────────────────────────────────
  isLoading = true;
  error: string | null = null;

  // ── Datos ──────────────────────────────────────────
  userName = '';
  userLevel = 0;
  institutionRank = 0;
  totalInstitutionUsers = 0;
  stats: StatCard[] = [];
  recentActivity: RecentActivity[] = [];
  environmentalImpact: EnvironmentalImpact[] = [];

  private destroy$ = new Subject<void>();

  constructor(private dashboardService: DashboardService) {}

  // ── Lifecycle ──────────────────────────────────────
  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Cargar datos ─────────────────────────────────────
  loadDashboardData(): void {
    this.isLoading = true;
    this.error = null;

    this.dashboardService.getDashboardSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.populateData(response.data);
          } else {
            this.error = response.message || 'Error al cargar los datos';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Error de conexión. Intenta más tarde.';
          this.isLoading = false;
          console.error('Dashboard error:', err);
        }
      });
  }

  // ── Popular datos ────────────────────────────────────
  private populateData(data: DashboardSummary): void {
    this.userName = data.userName;
    this.userLevel = data.userLevel;
    this.institutionRank = data.institutionRank;
    this.totalInstitutionUsers = data.totalInstitutionUsers;
    this.stats = data.stats;
    this.recentActivity = data.recentActivity;
    this.environmentalImpact = data.environmentalImpact;
  }

  // ── Helpers ──────────────────────────────────────────
  getTrendClass(trendType: string): string {
    return trendType;
  }

  getStatusClass(status: string): string {
    return status;
  }

  getMaterialIcon(type: string): string {
    const icons: Record<string, string> = {
      plastico: 'water',
      papel: 'document',
      vidrio: 'wine',
      metal: 'hardware-chip',
      organico: 'leaf',
      electronico: 'desktop'
    };
    return icons[type] || 'help-circle';
  }

  getRankPercentage(): number {
    if (!this.totalInstitutionUsers) return 0;
    return Math.round((this.institutionRank / this.totalInstitutionUsers) * 100);
  }

  retryLoad(): void {
    this.loadDashboardData();
  }
}
