import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-coordi-tabs',
  templateUrl: './user-coordi-tabs.page.html',
  styleUrls: ['./user-coordi-tabs.page.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class UserCoordiTabsPage {

  mobileMenuOpen = false;

  navLinks = [
    { path: '/coordinador/dashboard', icon: 'grid-outline', label: 'Dashboard', exact: false },
    { path: '/coordinador/gestion-residuos', icon: 'trash-bin-outline', label: 'Gestión de Residuos', exact: false },
    { path: '/coordinador/validar-reciclaje', icon: 'checkmark-circle-outline', label: 'Validar Reciclaje', exact: false },
    { path: '/coordinador/gestion-premios', icon: 'trophy-outline', label: 'Gestión de Premios', exact: false },
    { path: '/coordinador/estudiantes', icon: 'people-outline', label: 'Estudiantes', exact: false },
    { path: '/coordinador/estadisticas', icon: 'bar-chart-outline', label: 'Estadísticas', exact: false }
  ];

  constructor(private router: Router) {}

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  goToLanding(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.router.navigate(['/auth/login']);
  }
}
