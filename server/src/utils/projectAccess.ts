import { Project } from "../models/Project.model.js";
import { Types } from "mongoose";

export async function userCanAccessProject(userId: string, projectId: Types.ObjectId, isAdmin: boolean) {
  if (isAdmin) return true;

  const project = await Project.findById(projectId).populate("assignedTeams");
  if (!project) return false;

  return project.assignedTeams.some((team: any) =>
    team.members.some((memberId: any) => memberId.toString() === userId)
  );
}

export async function memberOfProjectTeam(userId: string, projectId: Types.ObjectId) {
  const project = await Project.findById(projectId).populate("assignedTeams");
  if (!project) return false;

  return project.assignedTeams.some((team: any) =>
    team.members.some((memberId: any) => memberId.toString() === userId)
  );
}