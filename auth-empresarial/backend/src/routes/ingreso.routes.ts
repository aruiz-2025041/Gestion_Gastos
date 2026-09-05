import { Router } from 'express';
import { crear, listar, obtener, actualizar, eliminar } from '../controllers/ingreso.controller';
import { validate } from '../middlewares/validate';
import { ingresoSchema } from '../utils/validators';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.use(verifyToken);

router.post('/', validate(ingresoSchema), crear);
router.get('/', listar);
router.get('/:id', obtener);
router.put('/:id', validate(ingresoSchema), actualizar);
router.delete('/:id', eliminar);

export default router;