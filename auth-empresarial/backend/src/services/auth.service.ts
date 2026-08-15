import { createUser, findUserByEmail, User } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateAccessToken, generateRefreshToken, TokenPayload } from '../utils/jwt';
import { AppError } from '../middlewares/errorHandler';
import { RegisterInput, LoginInput } from '../utils/validators';

function toPublicUser(user: User) {
  const { password_hash, ...publicUser } = user;
  return publicUser;
}

export async function registerUser(input: RegisterInput) {
  const existing = await findUserByEmail(input.email);
  if (existing) {
    throw new AppError('El correo ya esta registrado', 409);
  }

  const passwordHash = await hashPassword(input.password);
  const user = await createUser(input.name, input.email, passwordHash);

  return toPublicUser(user);
}

export async function loginUser(input: LoginInput) {
  const user = await findUserByEmail(input.email);

  if (!user || !user.is_active) {
    throw new AppError('Credenciales invalidas', 401);
  }

  const passwordMatches = await comparePassword(input.password, user.password_hash);

  if (!passwordMatches) {
    throw new AppError('Credenciales invalidas', 401);
  }

  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return { user: toPublicUser(user), accessToken, refreshToken };
}
