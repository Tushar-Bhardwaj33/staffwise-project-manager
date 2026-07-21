import type { Request, Response } from "express";
import { User } from "../models/User.model.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { signToken } from "../utils/jwt.js";

export const register = async (req: Request, res: Response) => {
  const { name, email, employeeId, password, skills } = req.body;

  const existing = await User.findOne({ $or: [{ email }, { employeeId }] });
  if (existing) {
    return res.status(409).json({ message: "Email or employeeId already in use" });
  }

  const passwordHash = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    employeeId,
    passwordHash,
    skills,
    role: "employee", // enforced regardless of what's sent — no admin signup
  });

  const token = signToken({ id: user._id.toString(), role: user.role });

  res.status(201).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signToken({ id: user._id.toString(), role: user.role });

  res.status(200).json({
    token,
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

export const logout = async (req: Request, res: Response) => {
  // JWT is stateless — logout is handled client-side by discarding the token.
  res.status(200).json({ message: "Logged out" });
};

export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id).select("-passwordHash");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({ user });
};