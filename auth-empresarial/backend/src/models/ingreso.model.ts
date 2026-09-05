import { pool } from '../config/db';

export interface Ingreso {
  id: number;
  user_id: number;
  categoria: string;
  descripcion: string;
  monto: number;
  fecha_ingreso: Date;
  metodo_pago: string;
  estado: string;
  notas: string | null;
  created_at: Date;
  updated_at: Date;
}

export async function createIngreso(
  userId: number,
  categoria: string,
  descripcion: string,
  monto: number,
  fechaIngreso: string,
  metodoPago: string,
  estado: string,
  notas: string | null
): Promise<Ingreso> {
  const result = await pool.query<Ingreso>(
    `INSERT INTO ingresos (user_id, categoria, descripcion, monto, fecha_ingreso, metodo_pago, estado, notas)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [userId, categoria, descripcion, monto, fechaIngreso, metodoPago, estado, notas]
  );
  return result.rows[0];
}

export async function findIngresosByUser(userId: number): Promise<Ingreso[]> {
  const result = await pool.query<Ingreso>(
    'SELECT * FROM ingresos WHERE user_id = $1 ORDER BY fecha_ingreso DESC',
    [userId]
  );
  return result.rows;
}

export async function findIngresoById(id: number, userId: number): Promise<Ingreso | null> {
  const result = await pool.query<Ingreso>(
    'SELECT * FROM ingresos WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rows[0] || null;
}

export async function updateIngreso(
  id: number,
  userId: number,
  categoria: string,
  descripcion: string,
  monto: number,
  fechaIngreso: string,
  metodoPago: string,
  estado: string,
  notas: string | null
): Promise<Ingreso | null> {
  const result = await pool.query<Ingreso>(
    `UPDATE ingresos
     SET categoria = $1, descripcion = $2, monto = $3, fecha_ingreso = $4,
         metodo_pago = $5, estado = $6, notas = $7, updated_at = NOW()
     WHERE id = $8 AND user_id = $9
     RETURNING *`,
    [categoria, descripcion, monto, fechaIngreso, metodoPago, estado, notas, id, userId]
  );
  return result.rows[0] || null;
}

export async function deleteIngreso(id: number, userId: number): Promise<boolean> {
  const result = await pool.query('DELETE FROM ingresos WHERE id = $1 AND user_id = $2', [
    id,
    userId,
  ]);
  return (result.rowCount ?? 0) > 0;
}