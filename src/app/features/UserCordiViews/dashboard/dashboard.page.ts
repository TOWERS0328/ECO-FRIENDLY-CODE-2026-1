import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';
import {
  DashboardStats,
  ActividadReciente,
  SolicitudReciclaje,
  Alerta
} from '../../../core/models/adminDashboard.models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: false
})
export class DashboardPage implements OnInit {

  stats: DashboardStats | null = null;
  solicitudesPendientes: SolicitudReciclaje[] = [];
  alertas: Alerta[] = [];
  actividadReciente: ActividadReciente[] = [];

  cargando = false;
  error: string | null = null;

  constructor(
    private dashboardService: AdminDashboardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.error = null;

    forkJoin({
      stats: this.dashboardService.getStats(),
      solicitudes: this.dashboardService.getSolicitudesPendientes(),
      alertas: this.dashboardService.getAlertas(),
      actividad: this.dashboardService.getActividadReciente()
    })
    .pipe(finalize(() => this.cargando = false))
    .subscribe({
      next: ({ stats, solicitudes, alertas, actividad }) => {
        this.stats = stats;
        this.solicitudesPendientes = solicitudes;
        this.alertas = alertas;
        this.actividadReciente = actividad;
      },
      error: (err) => {
        console.error('Error al cargar dashboard:', err);
        this.error = 'No se pudieron cargar los datos. Intenta de nuevo.';
      }
    });
  }

  aprobarSolicitud(id: string) {
    this.dashboardService.aprobarSolicitud(id).subscribe({
      next: () => {
        this.solicitudesPendientes = this.solicitudesPendientes.filter(s => s.id !== id);
        if (this.stats) {
          this.stats.solicitudesPendientes--;
          this.stats.reciclajesAprobados++;
        }
      },
      error: (err) => console.error('Error al aprobar solicitud:', err)
    });
  }

  rechazarSolicitud(id: string) {
    this.dashboardService.rechazarSolicitud(id).subscribe({
      next: () => {
        this.solicitudesPendientes = this.solicitudesPendientes.filter(s => s.id !== id);
        if (this.stats) this.stats.solicitudesPendientes--;
      },
      error: (err) => console.error('Error al rechazar solicitud:', err)
    });
  }

  irAGestionResiduos() {
    this.router.navigate(['/coordinador/gestion-residuos']);
  }

  irAValidarReciclaje() {
    this.router.navigate(['/coordinador/validar-reciclaje']);
  }

  irAEstadisticas() {
    this.router.navigate(['/coordinador/estadisticas']);
  }

  verTodasSolicitudes() {
    this.router.navigate(['/coordinador/validar-reciclaje']);
  }
}
