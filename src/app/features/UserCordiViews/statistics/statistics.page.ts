import {
  Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit
} from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StatisticsService } from '../../../core/services/adminStatistics.service';
import {
  SystemStats,
  TopStudent,
  WasteByCategory,
  MetricCard,
  StatsFilter,
  ReportConfig
} from '../../../core/models/adminStatistics.model';

Chart.register(...registerables);

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.page.html',
  styleUrls: ['./statistics.page.scss'],
  standalone: false
})
export class StatisticsPage implements OnInit, AfterViewInit, OnDestroy {

  // ─── Chart refs ─────────────────────────────────────────────────────────────
  @ViewChild('trendChart',    { static: false }) trendChartRef!:    ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChart', { static: false }) categoryChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('growthChart',   { static: false }) growthChartRef!:   ElementRef<HTMLCanvasElement>;
  @ViewChild('heatmapChart',  { static: false }) heatmapChartRef!:  ElementRef<HTMLCanvasElement>;

  private trendChart:    Chart | null = null;
  private categoryChart: Chart | null = null;
  private growthChart:   Chart | null = null;
  private heatmapChart:  Chart | null = null;

  // ─── State ───────────────────────────────────────────────────────────────────
  stats:              SystemStats | null = null;
  metricCards:        MetricCard[]       = [];
  topStudents:        TopStudent[]       = [];
  wasteByCategory:    WasteByCategory[]  = [];
  availableYears:     number[]           = [];
  selectedYear:       number             = new Date().getFullYear();
  isLoading:          boolean            = true;
  isExporting:        boolean            = false;
  chartsReady:        boolean            = false;

  // ─── Report panel toggle ─────────────────────────────────────────────────────
  showReportPanel = false;
  reportSections = {
    metrics:        true,
    'monthly-trend': true,
    'top-students':  true,
    'waste-categories': true
  };

  private destroy$ = new Subject<void>();

  constructor(
    private statsService: StatisticsService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.availableYears = this.statsService.getAvailableYears();
    this.loadData();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.destroyCharts();
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Load ────────────────────────────────────────────────────────────────────

  loadData(): void {
    this.isLoading = true;
    this.chartsReady = false;

    const filter: StatsFilter = { year: this.selectedYear };

    this.statsService.getStats(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.stats = data;
          this.topStudents = data.topStudents;
          this.wasteByCategory = data.wasteByCategory;
          this.metricCards = this.statsService.getMetricCards();
          this.isLoading = false;
          setTimeout(() => this.initCharts(), 150);
        },
        error: (err) => {
          console.error('Error loading statistics:', err);
          this.isLoading = false;
          this.showToast('Error loading statistics', 'danger');
        }
      });
  }

  onYearChange(year: number): void {
    this.selectedYear = year;
    this.destroyCharts();
    this.loadData();
  }

  // ─── Charts ──────────────────────────────────────────────────────────────────

  private async initCharts(): Promise<void> {
    if (this.chartsReady) return;
    try {
      await Promise.all([
        this.buildTrendChart(),
        this.buildCategoryChart(),
        this.buildGrowthChart(),
        this.buildHeatmapChart()
      ]);
      this.chartsReady = true;
    } catch (e) {
      console.error('Chart init error:', e);
    }
  }

  private async buildTrendChart(): Promise<void> {
    const ctx = this.trendChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;
    this.trendChart?.destroy();

    const data = await this.statsService.getTrendChartData(this.selectedYear).toPromise();

    const config: ChartConfiguration<'line'> = {
      type: 'line',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: { usePointStyle: true, padding: 16, font: { size: 12, weight: 'bold' } }
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            padding: 12,
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => {
                const suffix = ctx.datasetIndex === 0 ? ' kg' : ' students';
                return ` ${ctx.dataset.label}: ${ctx.parsed.y}${suffix}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11, weight: 'bold' }, color: '#6b7280' }
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: { font: { size: 11, weight: 'bold' }, color: '#6b7280', padding: 8 }
          }
        }
      }
    };
    this.trendChart = new Chart(ctx, config);
  }

  private async buildCategoryChart(): Promise<void> {
    const ctx = this.categoryChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;
    this.categoryChart?.destroy();

    const data = await this.statsService.getCategoryChartData().toPromise();

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            padding: 12,
            titleFont: { size: 13, weight: 'bold' },
            bodyFont: { size: 12 },
            borderColor: 'rgba(255,255,255,0.1)',
            borderWidth: 1,
            callbacks: {
              label: (ctx) => {
                const cat = this.wasteByCategory[ctx.dataIndex];
                return [`  ${ctx.label}: ${ctx.parsed}%`, `  ${cat.amount} kg`];
              }
            }
          }
        }
      }
    };
    this.categoryChart = new Chart(ctx, config);
  }

  private async buildGrowthChart(): Promise<void> {
    const ctx = this.growthChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;
    this.growthChart?.destroy();

    const data = await this.statsService.getGrowthChartData(this.selectedYear).toPromise();

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
  backgroundColor: 'rgba(15,23,42,0.9)',
  padding: 12,
  callbacks: {
    label: (ctx) => {
      const y = ctx.parsed?.y ?? 0;
      return ` Growth: ${y > 0 ? '+' : ''}${y}%`;
    }
  }
}
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11, weight: 'bold' }, color: '#6b7280' } },
          y: {
            grid: { color: 'rgba(0,0,0,0.04)' },
            ticks: {
              font: { size: 11, weight: 'bold' }, color: '#6b7280',
              callback: (val) => `${val}%`
            }
          }
        }
      }
    };
    this.growthChart = new Chart(ctx, config);
  }

  private async buildHeatmapChart(): Promise<void> {
    const ctx = this.heatmapChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;
    this.heatmapChart?.destroy();

    const { months, categories, data } =
      await this.statsService.getHeatmapData(this.selectedYear).toPromise();

    // Render as stacked bar acting as heatmap
    const palette = ['#10b981','#3b82f6','#a855f7','#f59e0b'];
    const datasets = categories.map((cat: string, i: number) => ({
      label: cat,
      data: data.map((row: number[]) => row[i]),
      backgroundColor: palette[i],
      borderRadius: 3,
      borderSkipped: false
    }));

    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: { labels: months, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: { usePointStyle: true, padding: 14, font: { size: 11, weight: 'bold' } }
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.9)',
            padding: 12,
            callbacks: {
              label: (ctx) => ` ${ctx.dataset.label}: ${ctx.parsed.y} kg`
            }
          }
        },
        scales: {
          x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10, weight: 'bold' }, color: '#6b7280' } },
          y: { stacked: true, grid: { color: 'rgba(0,0,0,0.04)' }, ticks: { font: { size: 10, weight: 'bold' }, color: '#6b7280', callback: (v) => `${v}kg` } }
        }
      }
    };
    this.heatmapChart = new Chart(ctx, config);
  }

  private destroyCharts(): void {
    [this.trendChart, this.categoryChart, this.growthChart, this.heatmapChart]
      .forEach(c => c?.destroy());
    this.trendChart = this.categoryChart = this.growthChart = this.heatmapChart = null;
  }

  // ─── Export ──────────────────────────────────────────────────────────────────

  async exportExcel(): Promise<void> {
    this.isExporting = true;
    const config: ReportConfig = {
      format: 'excel',
      filter: { year: this.selectedYear },
      sections: this.getActiveSections()
    };
    try {
      this.statsService.exportToExcel(config);
      this.showToast('Report exported to CSV/Excel', 'success');
    } catch {
      this.showToast('Export failed', 'danger');
    } finally {
      this.isExporting = false;
    }
  }

  async exportPdf(): Promise<void> {
    this.isExporting = true;
    const config: ReportConfig = {
      format: 'pdf',
      filter: { year: this.selectedYear },
      sections: this.getActiveSections()
    };
    try {
      this.statsService.exportToPdf(config);
      this.showToast('Print dialog opened for PDF export', 'success');
    } catch {
      this.showToast('Export failed', 'danger');
    } finally {
      this.isExporting = false;
    }
  }

  private getActiveSections() {
    return (Object.keys(this.reportSections) as (keyof typeof this.reportSections)[])
      .filter(k => this.reportSections[k]) as ReportConfig['sections'];
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  getTotalRecycledForYear(): number {
    return this.stats?.monthlyTrend.reduce((s, m) => s + m.recycledKg, 0) ?? 0;
  }

  getAvgMonthlyGrowth(): string {
    if (!this.stats) return '0';
    const growths = this.stats.monthlyTrend.slice(1).map(m => m.growth);
    return (growths.reduce((a, b) => a + b, 0) / growths.length).toFixed(1);
  }

  getPeakMonth(): string {
    if (!this.stats?.monthlyTrend.length) return '-';
    return [...this.stats.monthlyTrend]
      .sort((a, b) => b.recycledKg - a.recycledKg)[0].month;
  }

  trackById(_i: number, item: { id: number }): number {
    return item.id;
  }

  trackByCategory(_i: number, item: WasteByCategory): string {
    return item.category;
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      color,
      position: 'bottom',
      icon: color === 'success' ? 'checkmark-circle' : 'alert-circle'
    });
    await toast.present();
  }
}