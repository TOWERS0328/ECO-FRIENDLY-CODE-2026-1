import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  errorMessage = '';
  emailError = false;
  passwordError = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Si ya está logueado, redirigir a estudiante
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/estudiante']);
    }
  }

  validateEmail(): boolean {
    if (!this.email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.emailError = true;
      this.errorMessage = 'Por favor ingresa un correo electrónico válido.';
      return false;
    }
    return true;
  }

  validatePassword(): boolean {
    if (!this.password) {
      this.passwordError = true;
      this.errorMessage = 'Por favor ingresa tu contraseña.';
      return false;
    }
    if (this.password.length < 6) {
      this.passwordError = true;
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }
    return true;
  }

  clearErrors() {
    this.errorMessage = '';
    this.emailError = false;
    this.passwordError = false;
  }

  async onLogin() {
    this.clearErrors();

    if (!this.email) {
      this.emailError = true;
      this.errorMessage = 'Por favor ingresa tu correo universitario.';
      return;
    }
    if (!this.validateEmail()) return;
    if (!this.validatePassword()) return;

    this.isLoading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(['/estudiante']);  // ← CORREGIDO: /estudiante
        } else {
          this.errorMessage = response.message || 'Error al iniciar sesión.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos.';
          this.emailError = true;
          this.passwordError = true;
        } else {
          this.errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión.';
        }
      }
    });
  }

  forgotPassword() {
    this.router.navigate(['/auth/forgot-password']);
  }

  goToRegister() {
    this.router.navigate(['/auth/register']);
  }

  goToLanding() {
    this.router.navigate(['/landing']);
  }

  // ── Social login (placeholders) ──────────────────────
  async loginWithGoogle() {
    console.log('Google login - TODO implementar');
    this.errorMessage = 'Inicio de sesión con Google no disponible aún.';
  }

  async loginWithApple() {
    console.log('Apple login - TODO implementar');
    this.errorMessage = 'Inicio de sesión con Apple no disponible aún.';
  }

  async loginWithFacebook() {
    console.log('Facebook login - TODO implementar');
    this.errorMessage = 'Inicio de sesión con Facebook no disponible aún.';
  }
}
