import jwt from "jsonwebtoken";

export interface JwtPayload {
  id: string;
  role: "admin" | "employee";
}

const getSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set in .env");
  return secret;
};

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getSecret()) as JwtPayload;
};
