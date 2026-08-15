import { Router } from 'express';
import { register, login, refresh, me, logout } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../utils/validators';
import { verifyToken } from '../middlewares/verifyToken';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refresh);
router.get('/me', verifyToken, me);
router.post('/logout', verifyToken, logout);

export default router;
