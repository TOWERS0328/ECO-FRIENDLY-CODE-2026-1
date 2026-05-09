import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  // ── Variables del formulario ────────────────────────────
  cedula = '';
  nombre = '';
  apellido = '';
  email = '';
  carrera = '';
  password = '';
  genero = '';

  showPassword = false;
  isLoading = false;
  errorMessage = '';
  acceptTerms = false;

  // ── Steps UI ──────────────────────────────────────────
  showProgress = true;
  currentStep = 1;

  // ── Errores ─────────────────────────────────────────────
  cedulaError = false;
  nombreError = false;
  apellidoError = false;
  emailError = false;
  carreraError = false;
  passwordError = false;
  generoError = false;
  termsError = false;

  // ── Password strength ───────────────────────────────────
  passwordStrength = '';
  passwordStrengthText = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  // ── Validaciones ────────────────────────────────────────
  validateCedula() {
    this.cedulaError = this.cedula.length !== 10 || !/^\d+$/.test(this.cedula);
  }

  validateNombre() {
    this.nombreError = this.nombre.trim().length < 2;
  }

  validateApellido() {
    this.apellidoError = this.apellido.trim().length < 2;
  }

  validateGenero() {
    this.generoError = !this.genero;
  }

  validateEmail() {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.emailError = !regex.test(this.email);
  }

  validateCarrera() {
    this.carreraError = !this.carrera;
  }

  validatePasswordStrength() {
    const pwd = this.password;
    if (pwd.length < 6) {
      this.passwordStrength = 'weak';
      this.passwordStrengthText = 'Débil';
      this.passwordError = true;
    } else if (pwd.length < 8) {
      this.passwordStrength = 'medium';
      this.passwordStrengthText = 'Media';
      this.passwordError = false;
    } else {
      this.passwordStrength = 'strong';
      this.passwordStrengthText = 'Fuerte';
      this.passwordError = false;
    }
  }

  clearFieldError(field: string) {
    switch (field) {
      case 'cedula': this.cedulaError = false; break;
      case 'nombre': this.nombreError = false; break;
      case 'apellido': this.apellidoError = false; break;
      case 'genero': this.generoError = false; break;
      case 'email': this.emailError = false; break;
      case 'carrera': this.carreraError = false; break;
      case 'terms': this.termsError = false; break;
    }
  }

  // ── Registro ────────────────────────────────────────────
  onRegister() {
    this.validateCedula();
    this.validateNombre();
    this.validateApellido();
    this.validateGenero();
    this.validateEmail();
    this.validateCarrera();
    this.validatePasswordStrength();

    if (!this.acceptTerms) {
      this.termsError = true;
    }

    if (
      this.cedulaError || this.nombreError || this.apellidoError ||
      this.generoError || this.emailError || this.carreraError ||
      this.passwordError || !this.acceptTerms
    ) {
      this.errorMessage = 'Corrige los errores antes de continuar';
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;

    const request: RegisterRequest = {
      cedula: this.cedula,
      nombre: this.nombre,
      apellido: this.apellido,
      genero: this.genero,
      email: this.email,
      carrera: this.carrera,
      password: this.password
    };

    this.authService.register(request).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.router.navigate(['/auth/login']);
        } else {
          this.errorMessage = response.message || 'Error al registrarse.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 409) {
          this.errorMessage = 'El email o cédula ya están registrados.';
        } else {
          this.errorMessage = err.error?.message || 'Error de conexión. Intenta más tarde.';
        }
      }
    });
  }

  // ── Términos y privacidad ─────────────────────────────
  showTerms(event: Event) {
    event.preventDefault();
    alert('Términos y condiciones del servicio Eco Friendly.');
  }

  showPrivacy(event: Event) {
    event.preventDefault();
    alert('Política de privacidad de Eco Friendly.');
  }

  // ── Social register (placeholders) ────────────────────
  async registerWithGoogle() {
    console.log('Google register - TODO implementar');
    this.errorMessage = 'Registro con Google no disponible aún.';
  }

  async registerWithApple() {
    console.log('Apple register - TODO implementar');
    this.errorMessage = 'Registro con Apple no disponible aún.';
  }

  async registerWithFacebook() {
    console.log('Facebook register - TODO implementar');
    this.errorMessage = 'Registro con Facebook no disponible aún.';
  }

  // ── Navegación ──────────────────────────────────────────
  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  goToLanding() {
    this.router.navigate(['/landing']);
  }
}
