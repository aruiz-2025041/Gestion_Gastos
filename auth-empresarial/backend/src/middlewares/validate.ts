import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errores = result.error.issues.map((issue) => issue.message);
      return res.status(400).json({ message: 'Datos invalidos', errores });
    }

    req.body = result.data;
    next();
  };
}
