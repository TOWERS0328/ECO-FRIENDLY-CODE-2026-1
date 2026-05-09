import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ── Servicio e interfaces ─────────────────────────────────
import { RecycleService } from '../../../core/services/recycle.service';
import { Material, RecyclingSubmission, RecyclingResponse, ApiResponse, CanastaItem } from '../../../core/models/recycle.model';

@Component({
  selector: 'app-registrar-reciclaje',
  templateUrl: './registrar-reciclaje.page.html',
  styleUrls: ['./registrar-reciclaje.page.scss'],
  standalone: false
})
export class RegistrarReciclajePage implements OnInit, OnDestroy {

  // ── Estados ──────────────────────────────────────────────
  isLoading = true;
  error: string | null = null;
  isSubmitting = false;

  // ── Datos ────────────────────────────────────────────────
  searchQuery = '';
  activeCategory = 'todos';
  canastaOpen = false;
  canasta: CanastaItem[] = [];

  categories = [
    { key: 'todos',    label: 'Todos'    },
    { key: 'plastico', label: 'Plástico' },
    { key: 'papel',    label: 'Papel'    },
    { key: 'vidrio',   label: 'Vidrio'   },
    { key: 'metal',    label: 'Metal'    },
    { key: 'mixto',    label: 'Mixto'    },
  ];

  materials: Material[] = [];
  filteredMaterials: Material[] = [];

  private destroy$ = new Subject<void>();

  constructor(private recycleService: RecycleService) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ══════════════════════════════════════════════════════════
  // CARGAR DATOS
  // ══════════════════════════════════════════════════════════
  loadMaterials(): void {
    this.isLoading = true;
    this.error = null;

    this.recycleService.getAvailableMaterials()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<Material[]>) => {
          if (response.success && response.data) {
            this.materials = response.data;
            this.filteredMaterials = [...this.materials];
          } else {
            this.error = response.message || 'Error al cargar materiales';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Error de conexión al cargar materiales';
          this.isLoading = false;
          console.error('Materials error:', err);
        }
      });
  }

  // ══════════════════════════════════════════════════════════
  // FILTROS
  // ══════════════════════════════════════════════════════════
  setCategory(key: string): void {
    this.activeCategory = key;
    this.filterMaterials();
  }

  filterMaterials(): void {
    this.filteredMaterials = this.materials.filter(m => {
      const matchCat = this.activeCategory === 'todos' || m.categoryClass === this.activeCategory;
      const matchSearch = !this.searchQuery ||
        m.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  // ══════════════════════════════════════════════════════════
  // CANASTA
  // ══════════════════════════════════════════════════════════
  isInCanasta(id: string): boolean {
    return this.canasta.some(i => i.id === id);
  }

  toggleMaterial(material: Material): void {
    if (this.isInCanasta(material.id)) {
      this.removeFromCanasta(material.id);
    } else {
      this.canasta.push({ ...material, weight: 1 });
    }
  }

  removeFromCanasta(id: string): void {
    this.canasta = this.canasta.filter(i => i.id !== id);
  }

  toggleCanasta(): void {
    this.canastaOpen = !this.canastaOpen;
  }

  get estimatedPoints(): number {
    return Math.round(this.canasta.reduce((sum, i) => sum + (i.points * (i.weight || 0)), 0));
  }

  // ══════════════════════════════════════════════════════════
  // REGISTRAR RECICLAJE
  // ══════════════════════════════════════════════════════════
  registrarReciclaje(): void {
    if (this.canasta.length === 0) {
      this.error = 'Agrega materiales a la canasta';
      return;
    }

    const invalidItems = this.canasta.filter(item => !item.weight || item.weight <= 0);
    if (invalidItems.length > 0) {
      this.error = 'Todos los materiales deben tener un peso válido';
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    const submission: RecyclingSubmission = {
      items: this.canasta.map(item => ({
        materialId: item.id,
        weight: item.weight
      })),
      totalEstimatedPoints: this.estimatedPoints
    };

    this.recycleService.submitRecycling(submission)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<RecyclingResponse>) => {
          this.isSubmitting = false;
          if (response.success && response.data) {
            this.canasta = [];
            this.error = null;
            alert(`¡Reciclaje registrado! Puntos obtenidos: ${response.data.pointsEarned}`);
          } else {
            this.error = response.message || 'Error al registrar reciclaje';
          }
        },
        error: (err) => {
          this.isSubmitting = false;
          this.error = 'Error de conexión al registrar reciclaje';
          console.error('Submission error:', err);
        }
      });
  }

  // ══════════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════════
  retryLoad(): void {
    this.isLoading = true;
    this.error = null;
    this.loadMaterials();
  }
}
