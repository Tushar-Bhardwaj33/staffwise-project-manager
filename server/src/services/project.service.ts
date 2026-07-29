// server/src/services/project.service.ts
import { Project } from "../models/Project.model.js";
import "../models/Team.model.js"; // side-effect import: registers "Team" so populate("assignedTeams") works standalone

export const getProjectWithDetails = async (projectId: string) => {
  const project = await Project.findById(projectId).populate({
    path: "assignedTeams",
    populate: {
      path: "members",
      select: "name employeeId"
    }
  });
  if (!project) {
    throw new Error("PROJECT_NOT_FOUND");
  }
  return project;
};