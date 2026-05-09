import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ── Servicio (inyectado por el módulo) ───────────────────
import { HistoryService } from '../../../core/services/history.service';

// ── Interfaces (desde el archivo de modelos) ─────────────
import {
  HistoryItem,
  HistoryFilterOptions,
  ApiResponse,
  HistorySummary
} from '../../../core/models/history.model';

@Component({
  selector: 'app-mi-historial',
  templateUrl: './mi-historial.page.html',
  styleUrls: ['./mi-historial.page.scss'],
  standalone: false
})
export class MiHistorialPage implements OnInit, OnDestroy {

  // ── Estados ──────────────────────────────────────────────
  isLoading = true;
  error: string | null = null;

  // ── Datos ────────────────────────────────────────────────
  activeTipo   = 'todas';
  activeEstado = 'todos';

  tiposFiltro = [
    { key: 'todas',     label: 'Todas',      icon: 'list-outline'    },
    { key: 'reciclaje', label: 'Reciclajes', icon: 'refresh-outline' },
    { key: 'premio',    label: 'Premios',    icon: 'gift-outline'    },
  ];

  estadosFiltro = [
    { key: 'todos',     label: 'Todos',      colorClass: ''               },
    { key: 'aprobado',  label: 'Aprobados',  colorClass: 'aprobado-tab'   },
    { key: 'pendiente', label: 'Pendientes', colorClass: 'pendiente-tab'  },
    { key: 'rechazado', label: 'Rechazados', colorClass: 'rechazado-tab'  },
  ];

  // ── Datos del historial ──────────────────────────────────
  history: HistoryItem[] = [];
  filteredHistory: HistoryItem[] = [];

  // ── Resumen ──────────────────────────────────────────────
  totalItems = 0;
  totalRecyclings = 0;
  totalRewards = 0;
  approvedCount = 0;
  pendingCount = 0;
  rejectedCount = 0;
  totalPointsEarned = 0;
  totalPointsSpent = 0;

  private destroy$ = new Subject<void>();

  constructor(private historyService: HistoryService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ══════════════════════════════════════════════════════════
  // CARGAR DATOS
  // ══════════════════════════════════════════════════════════
  loadHistory(): void {
    this.isLoading = true;
    this.error = null;

    const filters: HistoryFilterOptions = {
      type: this.activeTipo as any,
      status: this.activeEstado as any,
      limit: 50
    };

    this.historyService.getHistorySummary(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<HistorySummary>) => {
          if (response.success && response.data) {
            const summary = response.data;

            this.history = summary.history || [];
            this.filteredHistory = [...this.history];

            this.totalItems = summary.totalItems;
            this.totalRecyclings = summary.totalRecyclings;
            this.totalRewards = summary.totalRewards;
            this.approvedCount = summary.approvedCount;
            this.pendingCount = summary.pendingCount;
            this.rejectedCount = summary.rejectedCount;
            this.totalPointsEarned = summary.totalPointsEarned;
            this.totalPointsSpent = summary.totalPointsSpent;

          } else {
            this.error = response.message || 'Error al cargar historial';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Error de conexión al cargar historial';
          this.isLoading = false;
          console.error('History error:', err);
        }
      });
  }

  // ══════════════════════════════════════════════════════════
  // FILTROS
  // ══════════════════════════════════════════════════════════
  setTipo(key: string): void {
    this.activeTipo = key;
    this.loadHistory();
  }

  setEstado(key: string): void {
    this.activeEstado = key;
    this.loadHistory();
  }

  // ── Filtro local (fallback) ──────────────────────────────
  applyFilters(): void {
    this.filteredHistory = this.history.filter(item => {
      const matchTipo   = this.activeTipo === 'todas'  || item.type   === this.activeTipo;
      const matchEstado = this.activeEstado === 'todos' || item.status === this.activeEstado;
      return matchTipo && matchEstado;
    });
  }

  // ══════════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════════
  getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      aprobado:  'checkmark-circle-outline',
      pendiente: 'time-outline',
      rechazado: 'close-circle-outline',
    };
    return icons[status] || 'ellipse-outline';
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      aprobado:  'Aprobado',
      pendiente: 'Pendiente',
      rechazado: 'Rechazado',
    };
    return labels[status] || status;
  }

  getStatusColorClass(status: string): string {
    const classes: Record<string, string> = {
      aprobado:  'status-aprobado',
      pendiente: 'status-pendiente',
      rechazado: 'status-rechazado',
    };
    return classes[status] || '';
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  retryLoad(): void {
    this.loadHistory();
  }

  viewDetail(itemId: string): void {
    console.log('Ver detalle:', itemId);
  }
}
