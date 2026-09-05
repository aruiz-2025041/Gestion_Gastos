// Requests y Responses para 'ingreso_fijo'
export interface SueldoFijoRequest {
  monto: number;
}

export interface SueldoFijoResponse {
  id?: number;
  userId?: number;
  monto: number;
  fechaActualizacion?: string;
}

// Requests y Responses para 'ingresos' (Extra y Variable)
export interface CrearIngresoRequest {
  tipo: 'extra' | 'variable';
  monto: number;
  categoria?: string;
  fechaIngreso?: string;
  metodoPago?: string;
  estado?: string;
  descripcion?: string;
}

export interface IngresoResponse {
  id?: number;
  tipo: string;
  monto: number;
  categoria?: string;
  fechaIngreso?: string;
  metodoPago?: string;
  estado?: string;
  descripcion?: string;
}