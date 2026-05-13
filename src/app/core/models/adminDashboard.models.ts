// ═══════════════════════════════════════════════════════
// MODELOS DEL ADMIN (Coordinador Ambiental)
// ═══════════════════════════════════════════════════════

// ─── Dashboard ───
export interface DashboardStats {
  solicitudesPendientes: number;
  estudiantesRegistrados: number;
  totalReciclado: number;
  reciclajesAprobados: number;
  tendencia: {
    solicitudes: string;
    estudiantes: string;
    reciclado: string;
    aprobados: string;
  };
}

export interface ActividadReciente {
  id: string;
  tipo: 'reciclaje' | 'premio' | 'registro';
  descripcion: string;
  usuario: string;
  fecha: Date;
  estado: 'completado' | 'pendiente' | 'rechazado';
}

// ─── Alertas ───
export interface Alerta {
  tipo: 'warning' | 'danger' | 'info';
  titulo: string;
  descripcion: string;
  fecha: Date;
  leida: boolean;
}

// ─── Residuos ───
export interface Residuo {
  id: string;
  nombre: string;
  categoria: 'plastico' | 'papel' | 'vidrio' | 'metal' | 'organico' | 'electronico';
  puntosPorKg: number;
  descripcion: string;
  icono: string;
  color: string;
  activo: boolean;
  instruccionesReciclaje: string;
}

export interface CategoriaResiduo {
  id: string;
  nombre: string;
  icono: string;
  color: string;
  totalRegistrado: number;
}

// ─── Validación de Reciclaje ───
// Esta interfaz se usa tanto en el módulo de validación
// como en el dashboard para las solicitudes pendientes
export interface SolicitudReciclaje {
  id: string;
  estudianteId: string;
  estudianteNombre: string;
  estudianteAvatar?: string;
  tipoResiduo: string;
  categoriaResiduo: string;
  peso: number;
  puntosCalculados: number;
  imagenes: string[];
  descripcion: string;
  fechaSolicitud: Date;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  comentarioValidacion?: string;
  validadoPor?: string;
  fechaValidacion?: Date;
}

export interface ValidacionRequest {
  estado: 'aprobado' | 'rechazado';
  comentario?: string;
  puntosAjustados?: number;
}

// ─── Premios ───
export interface Premio {
  id: string;
  nombre: string;
  descripcion: string;
  puntosRequeridos: number;
  cantidadDisponible: number;
  imagen?: string;
  categoria: 'merchandising' | 'experiencia' | 'descuento' | 'certificado';
  activo: boolean;
  fechaInicio?: Date;
  fechaFin?: Date;
  vecesCanjeado: number;
}

export interface CanjePremio {
  id: string;
  premioId: string;
  premioNombre: string;
  estudianteId: string;
  estudianteNombre: string;
  puntosCanjeados: number;
  fechaCanje: Date;
  estado: 'pendiente_entrega' | 'entregado' | 'cancelado';
}

// ─── Estudiantes ───
export interface Estudiante {
  id: string;
  nombre: string;
  email: string;
  avatar?: string;
  programa: string;
  semestre: number;
  puntosAcumulados: number;
  totalReciclado: number;
  reciclajesRealizados: number;
  premiosCanjeados: number;
  fechaRegistro: Date;
  ultimoAcceso?: Date;
  estado: 'activo' | 'inactivo' | 'suspendido';
  ranking: number;
}

export interface DetalleEstudiante extends Estudiante {
  historialReciclaje: SolicitudReciclaje[];
  historialCanjes: CanjePremio[];
  logros: Logro[];
}

export interface Logro {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  fechaObtencion: Date;
}

// ─── Estadísticas ───
export interface EstadisticasGenerales {
  totalEstudiantes: number;
  totalRecicladoKg: number;
  totalPuntosOtorgados: number;
  totalPremiosCanjeados: number;
  promedioReciclajePorEstudiante: number;
  reciclajePorCategoria: ReciclajePorCategoria[];
  reciclajePorMes: ReciclajePorMes[];
  topEstudiantes: TopEstudiante[];
  tendenciaAnual: number;
}

export interface ReciclajePorCategoria {
  categoria: string;
  cantidad: number;
  porcentaje: number;
}

export interface ReciclajePorMes {
  mes: string;
  cantidad: number;
}

export interface TopEstudiante {
  nombre: string;
  puntos: number;
  reciclado: number;
}

export interface ReporteFiltros {
  fechaInicio?: string;
  fechaFin?: string;
  categoria?: string;
  programa?: string;
  semestre?: number;
}

// ─── Notificaciones ───
export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: 'solicitud' | 'sistema' | 'premio';
  fecha: Date;
  leida: boolean;
  enlace?: string;
}
