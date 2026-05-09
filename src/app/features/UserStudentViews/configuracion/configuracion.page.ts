// ══════════════════════════════════════════════════════════
// Configuracion Page Component - EcoFriendly Code
// Preparado para integración con API
// ══════════════════════════════════════════════════════════

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ConfigurationService } from '../../../core/services/configuration.service';
import {
  ConfigurationSummary,
  UserProfile,
  UserSettings,
  NotificationItem,
  LanguageOption
} from '../../../core/models/configuration.model';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: false
})
export class ConfiguracionPage implements OnInit, OnDestroy {

  // ── Estado ───────────────────────────────────────────
  isLoading = true;
  error: string | null = null;
  isSaving = false;

  // ── Datos ──────────────────────────────────────────
  userProfile: UserProfile | null = null;
  userSettings: UserSettings | null = null;

  // Template data
  notifications: NotificationItem[] = [];
  currentTheme: 'light' | 'dark' = 'light';
  currentLanguage = 'es';
  languages: LanguageOption[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private configurationService: ConfigurationService,
    private router: Router
  ) {}

  // ── Lifecycle ──────────────────────────────────────
  ngOnInit(): void {
    this.loadConfigurationData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Cargar datos ─────────────────────────────────────
  loadConfigurationData(): void {
    this.isLoading = true;
    this.error = null;

    this.configurationService.getConfigurationSummary()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.populateData(response.data);
          } else {
            this.error = response.message || 'Error al cargar configuración';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.error = 'Error de conexión. Intenta más tarde.';
          this.isLoading = false;
          console.error('Configuration error:', err);
        }
      });
  }

  // ── Popular datos ────────────────────────────────────
  private populateData(data: ConfigurationSummary): void {
    this.userProfile = data.userProfile;
    this.userSettings = data.settings;
    this.languages = data.availableLanguages;

    // Configurar tema actual
    this.currentTheme = data.settings.theme;

    // Configurar idioma actual
    this.currentLanguage = data.settings.language;

    // Configurar notificaciones para el template
    this.notifications = [
      {
        id: 'recyclingApproved',
        title: 'Reciclaje aprobado',
        description: 'Recibe notificaciones cuando tu reciclaje sea validado',
        enabled: data.settings.notifications.recyclingApproved
      },
      {
        id: 'newRewards',
        title: 'Nuevos premios',
        description: 'Notificaciones sobre premios nuevos disponibles',
        enabled: data.settings.notifications.newRewards
      },
      {
        id: 'weeklyReport',
        title: 'Reporte semanal',
        description: 'Resumen semanal de tu actividad',
        enabled: data.settings.notifications.weeklyReport
      },
      {
        id: 'systemUpdates',
        title: 'Actualizaciones del sistema',
        description: 'Novedades y cambios importantes',
        enabled: data.settings.notifications.systemUpdates
      }
    ];
  }

  // ══════════════════════════════════════════════════════════
  // Acciones - Cuenta
  // ══════════════════════════════════════════════════════════
  editarPerfil(): void {
    this.router.navigate(['/estudiante/configuracion/editar-perfil']);
  }

  cambiarContrasena(): void {
    this.router.navigate(['/estudiante/configuracion/cambiar-contrasena']);
  }

  // ══════════════════════════════════════════════════════════
  // Acciones - Notificaciones
  // ══════════════════════════════════════════════════════════
  toggleNotification(notification: NotificationItem): void {
    notification.enabled = !notification.enabled;

    // Preparar objeto de actualización
    const notificationUpdate = {
      [notification.id]: notification.enabled
    };

    this.isSaving = true;

    this.configurationService.updateNotificationSettings(notificationUpdate)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          if (!response.success) {
            // Revertir cambio si falla
            notification.enabled = !notification.enabled;
            this.error = response.message || 'Error al actualizar notificaciones';
          }
        },
        error: (err) => {
          this.isSaving = false;
          // Revertir cambio si falla
          notification.enabled = !notification.enabled;
          this.error = 'Error de conexión al actualizar notificaciones';
          console.error('Update notification error:', err);
        }
      });
  }

  // ══════════════════════════════════════════════════════════
  // Acciones - Apariencia
  // ══════════════════════════════════════════════════════════
  setTheme(theme: 'light' | 'dark'): void {
    if (theme === 'dark') {
      // Por ahora, el tema oscuro no está disponible
      console.log('Tema oscuro próximamente');
      return;
    }

    const previousTheme = this.currentTheme;
    this.currentTheme = theme;
    this.isSaving = true;

    this.configurationService.updateTheme(theme)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          if (response.success) {
            // Aquí aplicarías el tema en toda la aplicación
            document.body.setAttribute('data-theme', theme);
          } else {
            // Revertir si falla
            this.currentTheme = previousTheme;
            this.error = response.message || 'Error al cambiar tema';
          }
        },
        error: (err) => {
          this.isSaving = false;
          // Revertir si falla
          this.currentTheme = previousTheme;
          this.error = 'Error de conexión al cambiar tema';
          console.error('Update theme error:', err);
        }
      });
  }

  // ══════════════════════════════════════════════════════════
  // Acciones - Idioma
  // ══════════════════════════════════════════════════════════
  onLanguageChange(event: any): void {
    const previousLanguage = this.currentLanguage;
    const newLanguage = event.target.value;

    this.currentLanguage = newLanguage;
    this.isSaving = true;

    this.configurationService.updateLanguage(newLanguage)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          if (response.success) {
            // Aquí cambiarías el idioma de la aplicación
            console.log('Idioma actualizado a:', newLanguage);
          } else {
            // Revertir si falla
            this.currentLanguage = previousLanguage;
            this.error = response.message || 'Error al cambiar idioma';
          }
        },
        error: (err) => {
          this.isSaving = false;
          // Revertir si falla
          this.currentLanguage = previousLanguage;
          this.error = 'Error de conexión al cambiar idioma';
          console.error('Update language error:', err);
        }
      });
  }

  // ══════════════════════════════════════════════════════════
  // Acciones - Zona de Peligro
  // ══════════════════════════════════════════════════════════
  eliminarCuenta(): void {
    const confirmacion = confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta?\n\n' +
      'Esta acción es IRREVERSIBLE y eliminará:\n' +
      '• Todos tus datos personales\n' +
      '• Tu historial de reciclaje\n' +
      '• Tus puntos acumulados\n' +
      '• Tus logros y premios\n\n' +
      'No podrás recuperar esta información.'
    );

    if (!confirmacion) {
      return;
    }

    // Solicitar contraseña para confirmar
    const password = prompt('Por favor, ingresa tu contraseña para confirmar:');

    if (!password) {
      return;
    }

    this.isSaving = true;

    this.configurationService.deleteAccount({
      password,
      confirmation: true,
      reason: 'Usuario solicitó eliminación de cuenta'
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isSaving = false;
          if (response.success) {
            alert('Tu cuenta ha sido eliminada exitosamente.');
            // Cerrar sesión y redirigir al login
            this.router.navigate(['/auth/login']);
          } else {
            this.error = response.message || 'Error al eliminar cuenta';
          }
        },
        error: (err) => {
          this.isSaving = false;
          this.error = 'Error de conexión al eliminar cuenta';
          console.error('Delete account error:', err);
        }
      });
  }

  // ── Helpers ──────────────────────────────────────────
  retryLoad(): void {
    this.loadConfigurationData();
  }

  getLanguageName(code: string): string {
    const language = this.languages.find(lang => lang.code === code);
    return language ? language.name : code;
  }
}
