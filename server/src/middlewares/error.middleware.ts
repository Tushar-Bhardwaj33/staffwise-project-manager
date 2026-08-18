import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);
 const isProd = process.env.NODE_ENV === "production";
 res.status(500).json({
 message: isProd ? "Internal server error" : err.message || "Internal server error",
 });
};
