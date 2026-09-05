import {
  createIngreso,
  findIngresosByUser,
  findIngresoById,
  updateIngreso,
  deleteIngreso,
} from '../models/ingreso.model';
import { IngresoInput } from '../utils/validators';

export async function registrarIngreso(userId: number, data: IngresoInput) {
  return createIngreso(
    userId,
    data.categoria,
    data.descripcion,
    data.monto,
    data.fecha_ingreso,
    data.metodo_pago,
    data.estado,
    data.notas ?? null
  );
}

export async function listarIngresos(userId: number) {
  return findIngresosByUser(userId);
}

export async function obtenerIngreso(id: number, userId: number) {
  const ingreso = await findIngresoById(id, userId);
  if (!ingreso) throw { status: 404, message: 'Ingreso no encontrado' };
  return ingreso;
}

export async function editarIngreso(id: number, userId: number, data: IngresoInput) {
  const ingreso = await updateIngreso(
    id,
    userId,
    data.categoria,
    data.descripcion,
    data.monto,
    data.fecha_ingreso,
    data.metodo_pago,
    data.estado,
    data.notas ?? null
  );
  if (!ingreso) throw { status: 404, message: 'Ingreso no encontrado' };
  return ingreso;
}

export async function eliminarIngreso(id: number, userId: number) {
  const eliminado = await deleteIngreso(id, userId);
  if (!eliminado) throw { status: 404, message: 'Ingreso no encontrado' };
}