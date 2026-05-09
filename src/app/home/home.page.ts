import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  NgZone,
  AfterViewInit,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {

  // ── State ─────────────────────────────────────────────
  isScrolled     = false;
  activeSection  = 'inicio';
  mobileMenuOpen = false;
  isMobile       = false;

  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private sectionObserver?: IntersectionObserver;

  // ── Data ──────────────────────────────────────────────
  stats = [
    { icon: 'people-outline',  value: '1,250',   label: 'Estudiantes Activos'  },
    { icon: 'leaf-outline',    value: '45.5 Ton', label: 'Material Reciclado'  },
    { icon: 'cloud-outline',   value: '82 Ton',   label: 'CO₂ Evitado'         },
    { icon: 'gift-outline',    value: '3,200+',   label: 'Premios Canjeados'   },
  ];

  statColors = ['green', 'purple', 'orange', 'gold'];

  steps = [
    {
      icon: 'person-add-outline',
      color: 'green',
      step: 'Paso 1',
      title: 'Regístrate',
      desc: 'Crea tu cuenta con tu correo universitario y código de estudiante',
    },
    {
      icon: 'refresh-circle-outline',
      color: 'green',
      step: 'Paso 2',
      title: 'Registra tu Reciclaje',
      desc: 'Selecciona los materiales, ingresa el peso y gana puntos automáticamente',
    },
    {
      icon: 'trophy-outline',
      color: 'gold',
      step: 'Paso 3',
      title: 'Canjea tus Premios',
      desc: 'Acumula puntos y canjéalos por productos eco-friendly, cupones y más',
    },
  ];

  rewards = [
    {
      icon: 'cube-outline',  iconColor: 'green',  category: 'Productos',
      categoryColor: 'purple', name: 'Botella Reutilizable',
      desc: 'Botella térmica de acero inoxidable de 500ml', points: 200,
    },
    {
      icon: 'cube-outline',  iconColor: 'green',  category: 'Productos',
      categoryColor: 'purple', name: 'Bolsa de Tela',
      desc: 'Bolsa reutilizable 100% algodón orgánico', points: 150,
    },
    {
      icon: 'cube-outline',  iconColor: 'green',  category: 'Papelería',
      categoryColor: 'blue',   name: 'Cuaderno Reciclado',
      desc: 'Cuaderno A5 hecho con papel 100% reciclado', points: 120,
    },
    {
      icon: 'gift-outline',  iconColor: 'orange', category: 'Cupones',
      categoryColor: 'orange', name: 'Cupón Cafetería',
      desc: 'Descuento 20% en la cafetería universitaria', points: 100,
    },
  ];

  testimonials = [
    {
      name: 'María García',
      university: 'Universidad Nacional',
      level: 'Nivel 5',
      stars: 5,
      quote: 'Llevo 3 meses usando la app y ya acumulé 1,250 puntos. ¡Es increíble cómo reciclar tiene recompensas reales!',
    },
    {
      name: 'Carlos Mendoza',
      university: 'Universidad de los Andes',
      level: 'Nivel 4',
      stars: 5,
      quote: 'Me motivó a reciclar más seguido. La interfaz es muy fácil de usar y los premios son geniales.',
    },
    {
      name: 'Laura Jiménez',
      university: 'UNAL Medellín',
      level: 'Nivel 6',
      stars: 5,
      quote: 'Gracias a EcoFriendly Code mi facultad mejoró sus indicadores de sostenibilidad este semestre.',
    },
  ];

  navLinks = [
    { label: 'Inicio',        anchor: 'inicio'        },
    { label: 'Cómo Funciona', anchor: 'como-funciona' },
    { label: 'Impacto',       anchor: 'impacto'       },
    { label: 'Premios',       anchor: 'premios'       },
    { label: 'Contacto',      anchor: 'contacto'      },
  ];

  // ─────────────────────────────────────────────────────
  constructor(
    private router: Router,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  // ── Lifecycle ─────────────────────────────────────────
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkMobile();
      this.setupResizeObserver();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Small delay so DOM is fully painted
      setTimeout(() => {
        this.setupScrollReveal();
        this.setupSectionDetection();
      }, 100);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.sectionObserver?.disconnect();
  }

  // ── Responsive helpers ────────────────────────────────
  private checkMobile(): void {
    this.isMobile = window.innerWidth < 768;
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.ngZone.run(() => {
        this.checkMobile();
        if (!this.isMobile) {
          this.mobileMenuOpen = false;
        }
      });
    });
    this.resizeObserver.observe(document.body);
  }

  // ── Scroll ────────────────────────────────────────────
  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled = window.scrollY > 40;
  }

  // ── Scroll-reveal with IntersectionObserver ───────────
  private setupScrollReveal(): void {
    const targets = document.querySelectorAll(
      '.step-card, .impact-card, .reward-card, .testimonial-card, ' +
      '.hero-left, .hero-right, .section-title, .section-subtitle'
    );

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.intersectionObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => {
      el.classList.add('reveal');
      this.intersectionObserver!.observe(el);
    });
  }

  // ── Active section detection ──────────────────────────
  private setupSectionDetection(): void {
    const sections = document.querySelectorAll('section[id]');

    this.sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.ngZone.run(() => {
              this.activeSection = entry.target.id;
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((s) => this.sectionObserver!.observe(s));
  }

  // ── Nav menu ──────────────────────────────────────────
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Prevent body scroll when menu is open
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    }
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  // ── Navigation ────────────────────────────────────────
  scrollTo(anchor: string): void {
    const el = document.getElementById(anchor);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.activeSection = anchor;
    this.closeMobileMenu();
  }

  goToLogin():    void { this.router.navigateByUrl('/auth/login'); }
  goToRegister(): void { this.router.navigateByUrl('/auth/register'); }
  goToManual():   void { this.router.navigateByUrl('/manual');        }

  // ── Utils ─────────────────────────────────────────────
  starsArray(n: number): number[] {
    return Array(n).fill(0);
  }
}
