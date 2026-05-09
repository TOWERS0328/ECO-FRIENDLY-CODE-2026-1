import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ── Servicio e interfaces ─────────────────────────────────
import { UserService, UserProfile } from '../../../core/services/user.service';
import { ApiResponse } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
  standalone: false
})
export class MiPerfilPage implements OnInit, OnDestroy {

  isLoading = true;
  error: string | null = null;
  userProfile: UserProfile | null = null;

  get userName(): string {
    return this.userProfile ? `${this.userProfile.nombre} ${this.userProfile.apellido}` : '—';
  }

  get fullName(): string { return this.userName; }
  get email(): string { return this.userProfile?.email || '—'; }
  get studentCode(): string { return this.userProfile?.cedula || '—'; }
  get institution(): string { return this.userProfile?.institution || '—'; }

  get registrationDate(): string {
    if (!this.userProfile?.registrationDate) return '—';
    return new Date(this.userProfile.registrationDate).toLocaleDateString('es-ES', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  }

  get userLevel(): number { return this.userProfile?.userLevel || 0; }
  get totalReciclajes(): number { return this.userProfile?.totalReciclajes || 0; }
  get premiosCanjeados(): number { return this.userProfile?.premiosCanjeados || 0; }
  get totalPoints(): number { return this.userProfile?.totalPoints || 0; }
  get materialReciclado(): number { return this.userProfile?.materialReciclado || 0; }
  get co2Evitado(): number { return this.userProfile?.co2Evitado || 0; }

  private destroy$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit(): void { this.loadProfile(); }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.error = null;

    this.userService.getProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: ApiResponse<UserProfile>) => {
          if (response.success && response.data) {
            this.userProfile = response.data;
          } else {
            this.error = response.message || 'Error al cargar el perfil';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Error de conexión. Intenta más tarde.';
          this.isLoading = false;
          console.error('Profile error:', err);
        }
      });
  }

  getRankPercentage(): number {
    if (!this.userProfile) return 0;
    const { institutionRank, totalInstitutionUsers } = this.userProfile;
    if (!totalInstitutionUsers) return 0;
    return Math.round((institutionRank / totalInstitutionUsers) * 100);
  }

  retryLoad(): void { this.loadProfile(); }
  onEditPhoto(): void { console.log('Editar foto'); }
  onEditProfile(): void { console.log('Editar perfil'); }
  onChangePassword(): void { console.log('Cambiar contraseña'); }
}
