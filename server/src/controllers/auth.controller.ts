import type { Request, Response } from "express";
import Type from "mongoose";
import { User } from "../models/User.model.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import { signToken } from "../utils/jwt.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" as const : "lax" as const,
  maxAge: 24 * 60 * 60 * 1000,
};

export const register = async (req: Request, res: Response) => {
  try {
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

    // user.passwordHash = undefined; // don't send the password hash back to the client

    const token = signToken({ id: user._id.toString(), role: user.role });

    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({
      user: user,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Something went wrong during registration" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
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

    const { passwordHash, ...safeUser } = user.toObject();

    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(200).json({
      user: safeUser,
    } as any);

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Something went wrong during login" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", COOKIE_OPTIONS);
    res.status(200).json({ message: "Logged out" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Something went wrong during logout" });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Something went wrong fetching user" });
  }
};