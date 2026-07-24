import type { Request, Response } from "express";
import { Types } from "mongoose";
import { Team } from "../models/Team.model.js";
import type { ITeam } from "../types/team.types.js";

export const getAllTeams = async (req: Request, res: Response) => {
  try {
    const teams = await Team.find({}).populate("members", "-passwordHash");
    res.status(200).json({ teams });
  } catch (err) {
    console.error("getAllTeams error:", err);
    res.status(500).json({ message: "Something went wrong fetching teams" });
  }
};

export const getTeamById = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.id;
    const team = await Team.findById(teamId).populate("members", "-passwordHash");

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.status(200).json({ team });
  } catch (err) {
    console.error("getTeamById error:", err);
    res.status(500).json({ message: "Something went wrong fetching the team" });
  }
};

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { name, members } = req.body;
    const createdBy = req.user?.id;

    console.log("createTeam request body:", req.body);

    if (!createdBy) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const existingTeam = await Team.findOne({ name });

    if (existingTeam) {
      return res.status(400).json({ message: "Team name already exists" });
    }

    const memberIds = members?.map((memberId: string) => new Types.ObjectId(memberId));
    const teamData = {
      name,
      createdBy: new Types.ObjectId(createdBy) as any,
      ...(memberIds ? { members: memberIds } : {}),
    };

    const team = await Team.create(teamData);
    res.status(201).json({ team });
  } catch (err) {
    console.error("createTeam error:", err);
    res.status(500).json({ message: "Something went wrong creating the team" });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.id;
    const { name, members } = req.body as { name?: string; members?: string[] };

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { name, members },
      { new: true, runValidators: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.status(200).json({ team: updatedTeam });
  } catch (err) {
    console.error("updateTeam error:", err);
    res.status(500).json({ message: "Something went wrong updating the team" });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.id;
    const deletedTeam = await Team.findByIdAndDelete(teamId);

    if (!deletedTeam) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (err) {
    console.error("deleteTeam error:", err);
    res.status(500).json({ message: "Something went wrong deleting the team" });
  }
};

export const addMemberToTeam = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.id;
    const { userId } = req.body as { userId: string };

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const alreadyMember = team.members.some((m) => m.toString() === userId);
    if (alreadyMember) {
      return res.status(400).json({ message: "User is already a member of the team" });
    }

    const memberObjectId = new Types.ObjectId(userId) as unknown as typeof team.members[number];
    team.members.push(memberObjectId);
    await team.save();

    res.status(200).json({ team });
  } catch (err) {
    console.error("addMemberToTeam error:", err);
    res.status(500).json({ message: "Something went wrong adding the member to the team" });
  }
};

export const removeMemberFromTeam = async (req: Request, res: Response) => {
  try {
    const teamId = req.params.id;
    const userId = req.params.userId;

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    const isMember = team.members.some((m) => m.toString() === userId);
    if (!isMember) {
      return res.status(400).json({ message: "User is not a member of the team" });
    }

    team.members = team.members.filter((m) => m.toString() !== userId);
    await team.save();

    res.status(200).json({ team });
  } catch (err) {
    console.error("removeMemberFromTeam error:", err);
    res.status(500).json({ message: "Something went wrong removing the member from the team" });
  }
};