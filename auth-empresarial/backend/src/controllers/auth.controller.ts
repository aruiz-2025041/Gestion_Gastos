  import { Request, Response, NextFunction } from 'express';
  import { registerUser, loginUser } from '../services/auth.service';
  import { findUserById } from '../models/user.model';
  import { generateAccessToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';
  import { AuthRequest } from '../middlewares/verifyToken';

  const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/api/auth',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  export async function register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await registerUser(req.body);
      res.status(201).json({ message: 'Usuario registrado correctamente', user });
    } catch (error) {
      next(error);
    }
  }

  export async function login(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, accessToken, refreshToken } = await loginUser(req.body);
      res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
      res.json({ message: 'Login exitoso', user, accessToken });
    } catch (error) {
      next(error);
    }
  }

  export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.cookies?.refreshToken;
      if (!token) {
        return res.status(401).json({ message: 'No hay sesion activa' });
      }

      const payload = verifyRefreshToken(token) as TokenPayload;
      const accessToken = generateAccessToken({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      });

      res.json({ accessToken });
    } catch (error) {
      res.status(401).json({ message: 'Sesion invalida o expirada' });
    }
  }

  export async function me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const user = await findUserById(userId);

      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const { password_hash, ...publicUser } = user;
      res.json({ user: publicUser });
    } catch (error) {
      next(error);
    }
  }

  export async function logout(_req: Request, res: Response) {
    res.clearCookie('refreshToken', { path: '/api/auth' });
    res.json({ message: 'Sesion cerrada correctamente' });
  }
