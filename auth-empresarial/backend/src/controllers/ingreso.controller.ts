import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/verifyToken';
import {
  registrarIngreso,
  listarIngresos,
  obtenerIngreso,
  editarIngreso,
  eliminarIngreso,
} from '../services/ingreso.service';

export async function crear(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const ingreso = await registrarIngreso(userId, req.body);
    res.status(201).json({ message: 'Ingreso registrado correctamente', ingreso });
  } catch (error) {
    next(error);
  }
}

export async function listar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const ingresos = await listarIngresos(req.user!.userId);
    res.json({ ingresos });
  } catch (error) {
    next(error);
  }
}

export async function obtener(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const ingreso = await obtenerIngreso(Number(req.params.id), req.user!.userId);
    res.json({ ingreso });
  } catch (error) {
    next(error);
  }
}

export async function actualizar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const ingreso = await editarIngreso(Number(req.params.id), req.user!.userId, req.body);
    res.json({ message: 'Ingreso actualizado correctamente', ingreso });
  } catch (error) {
    next(error);
  }
}

export async function eliminar(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    await eliminarIngreso(Number(req.params.id), req.user!.userId);
    res.json({ message: 'Ingreso eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}