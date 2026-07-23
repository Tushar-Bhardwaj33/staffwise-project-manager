import type { Request, Response } from "express";
import { Preference } from "../models/Preference.model.js";
import { Types } from "mongoose";

const VALID_INTERESTS = ["interested", "not-interested"];

export const submitPreference = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const rawProjectId = req.params.id;
    const projectId = Array.isArray(rawProjectId) ? rawProjectId[0] : rawProjectId; // ensure string

    if (!projectId) {
      return res.status(400).json({ message: "Project id is required" });
    }

    if (!Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const { interest, reason } = req.body;

    if (!VALID_INTERESTS.includes(interest)) {
      return res.status(400).json({ message: "Invalid interest value" });
    }

    const existingPreference = await Preference.findOne({
      employee: userId,
      project: projectId,
    });
    
    if (existingPreference) {
      existingPreference.interest = interest;
      if (reason !== undefined) {
        existingPreference.reason = reason;
      }
      await existingPreference.save();
      return res.status(200).json({ message: "Preference updated successfully", preference: existingPreference });
    }

    const preference = await Preference.create({
      employee: userId,
      project: projectId,
      interest,
      reason,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "Preference submitted successfully", preference });
  } catch (error) {
    console.error("submitPreference error:", error);
    return res.status(500).json({ message: "Something went wrong submitting the preference" });
  }
};

export const viewPreferences = async (req: Request, res: Response) => {
  try {
    const rawProjectId = req.params.id;
    const projectId = Array.isArray(rawProjectId) ? rawProjectId[0] : rawProjectId; // ensure string

    if (!projectId || !Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    const preferences = await Preference.find({ project: projectId }).populate(
      "employee",
      "name email employeeId skills"
    );

    return res.status(200).json({ preferences });
  } catch (error) {
    console.error("viewPreferences error:", error);
    return res.status(500).json({ message: "Something went wrong viewing the preferences" });
  }
};