import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().trim().email('Correo invalido'),
  password: z.string().min(8, 'La contrasena debe tener al menos 8 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().trim().email('Correo invalido'),
  password: z.string().min(1, 'La contrasena es requerida'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export const ingresoSchema = z.object({
  categoria: z.string().trim().min(2, 'La categoria es requerida'),
  descripcion: z.string().trim().min(3, 'La descripcion debe tener al menos 3 caracteres'),
  monto: z.number().positive('El monto debe ser mayor a 0'),
  fecha_ingreso: z.string().trim().min(1, 'La fecha es requerida'),
  metodo_pago: z.string().trim().min(2, 'El metodo de pago es requerido'),
  estado: z.string().trim().min(2, 'El estado es requerido'),
  notas: z.string().trim().optional().nullable(),
});

export type IngresoInput = z.infer<typeof ingresoSchema>;