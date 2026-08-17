import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "yup";
import type { AnySchema } from "yup";

export const validate =
  (schema: AnySchema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
      next();
    } catch (err) {
      if (err instanceof ValidationError) {
        const errors = err.inner.reduce<Record<string, string>>((acc, e) => {
          if (e.path) acc[e.path] = e.message;
          return acc;
        }, {});
        return res.status(400).json({ errors });
      }
      next(err);
    }
  };
