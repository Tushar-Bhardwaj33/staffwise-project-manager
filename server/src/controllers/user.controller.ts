import type { Request, Response } from "express";
import { Types } from "mongoose";
import { User } from "../models/User.model.js";
import { Preference } from "../models/Preference.model.js";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select("-passwordHash");
    res.status(200).json({ users });
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ message: "Something went wrong fetching users" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Employees can only view their own profile; admins can view any
    if (req.user?.role !== "admin" && req.user?.id !== userId) {
      return res.status(403).json({ message: "Forbidden — you can only view your own profile" });
    }

    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("getUserById error:", err);
    res.status(500).json({ message: "Something went wrong fetching user" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    if (req.user?.role !== "admin" && req.user?.id !== userId) {
      return res.status(403).json({ message: "Forbidden — you can only update your own profile" });
    }

    const { name, skills } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      { ...(name && { name }), ...(skills && { skills }) },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: updated });
  } catch (err) {
    console.error("updateProfile error:", err);
    res.status(500).json({ message: "Something went wrong updating profile" });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { role } = req.body;

    const updated = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select("-passwordHash");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: updated });
  } catch (err) {
    console.error("updateRole error:", err);
    res.status(500).json({ message: "Something went wrong updating role" });
  }
};

export const getUserHistory = async (req: Request, res: Response) => {
  try {
    const userIdParam = req.params.id;
    const userId = typeof userIdParam === "string" ? userIdParam : undefined;

    if (!userId) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    if (req.user?.role !== "admin" && req.user?.id !== userId) {
      return res.status(403).json({ message: "Forbidden — you can only view your own history" });
    }

    const { EmployeeReflection } = await import("../models/History.model.js");

    const reflections = await EmployeeReflection.find({ employeeId: new Types.ObjectId(userId) })
      .populate("projectId")
      .sort({ createdAt: -1 });

    // The frontend expects an array of projects for the history tab
    const history = reflections
      .map((r: any) => r.projectId)
      .filter(Boolean);

    res.status(200).json({ history });
  } catch (err) {
    console.error("getUserHistory error:", err);
    res.status(500).json({ message: "Something went wrong fetching history" });
  }
};