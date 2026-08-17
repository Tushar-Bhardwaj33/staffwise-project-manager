// server/src/services/project.service.ts
import { Project } from "../models/project.model.js";
import "../models/team.model.js"; // side-effect import: registers "Team" so populate("assignedTeams") works standalone

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
