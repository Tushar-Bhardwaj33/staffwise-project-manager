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
        return res.status(400).json({ errors: err.errors });
      }
      next(err);
    }
  };