import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ── Servicio e interfaces ─────────────────────────────────
import { RewardsService } from '../../../core/services/rewards.service';
import { Reward, RedemptionRequest, ApiResponse, UserPoints, RedemptionResponse } from '../../../core/models/rewards.model';

interface Premio extends Reward {}

@Component({
  selector: 'app-premios',
  templateUrl: './premios.page.html',
  styleUrls: ['./premios.page.scss'],
  standalone: false
})
export class PremiosPage implements OnInit, OnDestroy {

  // ── Estados ──────────────────────────────────────────────
  isLoading = true;
  error: string | null = null;
  isRedeeming = false;

  // ── Datos ────────────────────────────────────────────────
  availablePoints = 0;
  searchQuery = '';
  activeCategory = 'todos';
  carritoOpen = false;
  carrito: Premio[] = [];

  categories = [
    { key: 'todos',           label: 'Todos'           },
    { key: 'Productos',       label: 'Productos'       },
    { key: 'Cupones',         label: 'Cupones'         },
    { key: 'Plantas',         label: 'Plantas'         },
    { key: 'Papelería',       label: 'Papelería'       },
    { key: 'Entretenimiento', label: 'Entretenimiento' },
    { key: 'Tecnología',      label: 'Tecnología'      },
  ];

  premios: Premio[] = [];
  filteredPremios: Premio[] = [];

  private destroy$ = new Subject<void>();

  constructor(private rewardsService: RewardsService) {}

  ngOnInit(): void {
    this.loadRewards();
    this.loadUserPoints();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ══════════════════════════════════════════════════════════
  // CARGAR DATOS
  // ══════════════════════════════════════════════════════════
  loadRewards(): void {
    this.rewardsService.getAvailableRewards()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<Reward[]>) => {
          if (response.success && response.data) {
            this.premios = response.data;
            this.filteredPremios = [...this.premios];
          } else {
            this.error = response.message || 'Error al cargar premios';
          }
        },
        error: (err) => {
          this.error = 'Error de conexión al cargar premios';
          console.error('Rewards error:', err);
        }
      });
  }

  loadUserPoints(): void {
    this.rewardsService.getUserPoints()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<UserPoints>) => {
          if (response.success && response.data) {
            this.availablePoints = response.data.availablePoints;
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Points error:', err);
        }
      });
  }

  // ══════════════════════════════════════════════════════════
  // FILTROS
  // ══════════════════════════════════════════════════════════
  setCategory(key: string): void {
    this.activeCategory = key;
    this.filterPremios();
  }

  filterPremios(): void {
    this.filteredPremios = this.premios.filter(p => {
      const matchCat = this.activeCategory === 'todos' || p.category === this.activeCategory;
      const matchSearch = !this.searchQuery ||
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  // ══════════════════════════════════════════════════════════
  // CARRITO
  // ══════════════════════════════════════════════════════════
  isInCarrito(id: string): boolean {
    return this.carrito.some(i => i.id === id);
  }

  toggleCarrito2(premio: Premio): void {
    if (this.isInCarrito(premio.id)) {
      this.removeFromCarrito(premio.id);
    } else {
      this.carrito.push({ ...premio });
    }
  }

  removeFromCarrito(id: string): void {
    this.carrito = this.carrito.filter(i => i.id !== id);
  }

  toggleCarrito(): void {
    this.carritoOpen = !this.carritoOpen;
  }

  get totalPoints(): number {
    return this.carrito.reduce((sum, i) => sum + i.points, 0);
  }

  // ══════════════════════════════════════════════════════════
  // CANJEAR PREMIOS
  // ══════════════════════════════════════════════════════════
  canjearPremios(): void {
    if (this.totalPoints > this.availablePoints) {
      this.error = 'No tienes suficientes puntos';
      return;
    }
    if (this.carrito.length === 0) {
      this.error = 'Agrega premios al carrito';
      return;
    }

    this.isRedeeming = true;
    this.error = null;

    const request: RedemptionRequest = {
      rewards: this.carrito.map(p => ({ rewardId: p.id, quantity: 1 })),
      totalPoints: this.totalPoints
    };

    this.rewardsService.redeemRewards(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<RedemptionResponse>) => {
          this.isRedeeming = false;
          if (response.success && response.data) {
            this.availablePoints = response.data.remainingPoints;
            this.carrito = [];
            this.loadUserPoints();
            this.loadRewards();
            alert('¡Premios canjeados exitosamente!');
          } else {
            this.error = response.message || 'Error al canjear premios';
          }
        },
        error: (err) => {
          this.isRedeeming = false;
          this.error = 'Error de conexión al canjear premios';
          console.error('Redemption error:', err);
        }
      });
  }

  // ══════════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════════
  retryLoad(): void {
    this.isLoading = true;
    this.error = null;
    this.loadRewards();
    this.loadUserPoints();
  }
}
