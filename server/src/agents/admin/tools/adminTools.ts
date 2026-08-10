import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { Project } from "../../../models/Project.model.js";
import { Team } from "../../../models/Team.model.js";
import { User } from "../../../models/User.model.js";
import { findEmployeeByIdentifier, getProjectsForEmployee } from "../../../services/employee.service.js";
import { getProjectWithDetails } from "../../../services/project.service.js";

const formatTeam = (t: any) =>
  `${t.name} (Members: ${(t.members || []).map((m: any) => m.name).join(", ") || "none"})`;

export const listProjectsTool = tool(
  async () => {
    const projects = await Project.find()
      .select("title type requiredSkills startDate endDate assignedTeams")
      .populate({ path: "assignedTeams", select: "name members", populate: { path: "members", select: "name employeeId" } })
      .lean();

    if (!projects.length) return "No projects exist yet.";

    return projects
      .map((p: any) => {
        const teamMembers = (p.assignedTeams || []).flatMap((t: any) => t.members || []).map((m: any) => m.name);
        return `- ${p.title} (${p.type}). Skills: ${p.requiredSkills.join(", ") || "none"}. Timeline: ${new Date(p.startDate).toDateString()} - ${new Date(p.endDate).toDateString()}. Assigned: ${teamMembers.join(", ") || "none"}`;
      })
      .join("\n");
  },
  {
    name: "list_projects",
    description: "List all projects with their type, required skills, timeline, and who's assigned. Use this to see what's currently active or to figure out who's busy.",
    schema: z.object({}),
  }
);

export const listEmployeesTool = tool(
  async () => {
    const employees = await User.find({ role: "employee" }).select("name employeeId skills").lean();
    if (!employees.length) return "No employees exist yet.";
    return employees.map((e: any) => `- ${e.name} (ID: ${e.employeeId}). Skills: ${e.skills.join(", ") || "none listed"}`).join("\n");
  },
  {
    name: "list_employees",
    description: "List all employees with their employee ID and skills. Use this for skill-matching or roster questions.",
    schema: z.object({}),
  }
);

export const listTeamsTool = tool(
  async () => {
    const teams = await Team.find().select("name members").populate({ path: "members", select: "name employeeId" }).lean();
    if (!teams.length) return "No teams exist yet.";
    return teams.map(formatTeam).join("\n");
  },
  {
    name: "list_teams",
    description: "List all teams and their members.",
    schema: z.object({}),
  }
);

export const getProjectDetailsTool = tool(
  async ({ projectId }: { projectId: string }) => {
    try {
      const p: any = await getProjectWithDetails(projectId);
      return `Project "${p.title}" (${p.type}): ${p.description}\nRequired skills: ${p.requiredSkills.join(", ")}\nTimeline: ${new Date(p.startDate).toDateString()} - ${new Date(p.endDate).toDateString()}\nAssigned teams: ${(p.assignedTeams || []).map(formatTeam).join("; ") || "none"}`;
    } catch {
      return "No project found with that ID. Use list_projects to find the correct ID first.";
    }
  },
  {
    name: "get_project_details",
    description: "Get full details for one project by its MongoDB ID. Call list_projects first if you don't already have the ID.",
    schema: z.object({ projectId: z.string().describe("The MongoDB ObjectId of the project") }),
  }
);

export const findEmployeeTool = tool(
  async ({ identifier }: { identifier: number }) => {
    try {
      const employee: any = await findEmployeeByIdentifier(identifier);
      const projects = await getProjectsForEmployee(employee._id.toString());
      const projectList = projects.map((p: any) => p.title).join(", ") || "none";
      return `Employee ${employee.name} (ID: ${employee.employeeId}). Skills: ${employee.skills.join(", ") || "none listed"}. Current projects: ${projectList}`;
    } catch {
      return "No employee found matching that name or ID.";
    }
  },
  {
    name: "find_employee",
    description: "Find one employee by name or employee ID, and see their skills and current projects.",
    schema: z.object({ identifier: z.string().describe("Employee name or employee ID") }),
  }
);

export const adminTools = [listProjectsTool, listEmployeesTool, listTeamsTool, getProjectDetailsTool, findEmployeeTool];
