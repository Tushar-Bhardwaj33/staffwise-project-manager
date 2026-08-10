import type { Request, Response } from "express";
import { Project } from "../models/Project.model.js";
import { Team } from "../models/Team.model.js";
import { Types } from "mongoose";

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find({}).populate("assignedTeams");
    res.status(200).json({ projects });
  } catch (error) {
    console.error("getAllProjects error:", error);
    res.status(500).json({ message: "Something went wrong fetching projects" });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId).populate("assignedTeams");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("getProjectById error:", error);
    res.status(500).json({ message: "Something went wrong fetching the project" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const { title, description, type, requiredSkills, startDate, endDate } = req.body;
    const createdBy = req.user?.id;

    if (!createdBy) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingProject = await Project.findOne({ 
      title: { $regex: new RegExp(`^${title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, "i") } 
    });
    if (existingProject) {
      return res.status(400).json({ message: "A project with this name already exists" });
    }

    const project = await Project.create({
      title,
      description,
      type,
      requiredSkills,
      startDate,
      endDate,
      createdBy: new Types.ObjectId(createdBy),
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error("createProject error:", error);
    res.status(500).json({ message: "Something went wrong creating the project" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const { title, description, type, requiredSkills, startDate, endDate } = req.body;

    if (title) {
      const existingProject = await Project.findOne({ 
        title: { $regex: new RegExp(`^${title.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, "i") },
        _id: { $ne: projectId }
      });
      if (existingProject) {
        return res.status(400).json({ message: "A project with this name already exists" });
      }
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { title, description, type, requiredSkills, startDate, endDate },
      { new: true, runValidators: true }
    ).populate("assignedTeams");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("updateProject error:", error);
    res.status(500).json({ message: "Something went wrong updating the project" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("deleteProject error:", error);
    res.status(500).json({ message: "Something went wrong deleting the project" });
  }
};

export const assignTeamToProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const { teamId } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { assignedTeams: teamId } },
      { new: true }
    ).populate("assignedTeams");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("assignTeamToProject error:", error);
    res.status(500).json({ message: "Something went wrong assigning the team" });
  }
};

export const unassignTeamFromProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const teamId = req.params.teamId;

    const project = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { assignedTeams: teamId } },
      { new: true }
    ).populate("assignedTeams");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("unassignTeamFromProject error:", error);
    res.status(500).json({ message: "Something went wrong unassigning the team" });
  }
};