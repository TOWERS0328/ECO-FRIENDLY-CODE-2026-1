import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-student-tabs',
  templateUrl: './user-student-tabs.page.html',
  styleUrls: ['./user-student-tabs.page.scss'],
  standalone: false,
  encapsulation: ViewEncapsulation.None
})
export class UserStudentTabsPage {

  // Estado del menú móvil
  mobileMenuOpen = false;

  // Links de navegación (iconos actualizados según la imagen)
  navLinks = [
    {
      path: '/estudiante/dashboard',
      icon: 'home-outline', // Dashboard como primer item
      label: 'Dashboard',
      exact: false
    },
    {
      path: '/estudiante/perfil',
      icon: 'person-outline',
      label: 'Mi Perfil',
      exact: false
    },
    {
      path: '/estudiante/reciclaje',
      icon: 'sync-outline', // o 'refresh-outline' o 'reload-outline'
      label: 'Registrar Reciclaje',
      exact: false
    },
    {
      path: '/estudiante/premios',
      icon: 'gift-outline',
      label: 'Premios',
      exact: false
    },
    {
      path: '/estudiante/historial',
      icon: 'time-outline',
      label: 'Mi Historial',
      exact: false
    },
    {
      path: '/estudiante/configuracion',
      icon: 'settings-outline',
      label: 'Configuración',
      exact: false
    },
  ];

  constructor(private router: Router) {}

  /**
   * Alterna el estado del menú móvil
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  /**
   * Cierra el menú móvil
   */
  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  /**
   * Navega a la página de inicio/landing
   */
  goToLanding(): void {
    this.router.navigate(['/']);
  }

  /**
   * Cierra sesión y redirige al login
   */
  logout(): void {
    // Aquí puedes agregar lógica de limpieza de sesión:
    // - Limpiar localStorage
    // - Limpiar tokens
    // - Llamar a un servicio de auth

    // localStorage.removeItem('token');
    // this.authService.logout();

    this.router.navigate(['/auth/login']);
  }
}
