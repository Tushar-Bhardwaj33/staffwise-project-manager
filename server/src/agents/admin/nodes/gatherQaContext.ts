import { getProjectWithDetails } from "../../../services/project.service.js";
import { findEmployeeByIdentifier, getProjectsForEmployee } from "../../../services/employee.service.js";
import { Project } from "../../../models/Project.model.js";
import { User } from "../../../models/User.model.js";
import type { AdminAgentState } from "../state.js";

export const gatherQaContext: typeof AdminAgentState.Node = async (state) => {
  const [projectContext, employeeContext] = await Promise.all([
    state.projectId ? getProjectWithDetails(state.projectId) : Promise.resolve(undefined),
    state.employeeIdentifier ? findEmployeeByIdentifier(state.employeeIdentifier) : Promise.resolve(undefined),
  ]);

  const employeeProjects = employeeContext
    ? await getProjectsForEmployee(employeeContext._id.toString())
    : undefined;

  let globalContext = undefined;
  if (!state.projectId && !state.employeeIdentifier) {
    const { Team } = await import("../../../models/Team.model.js");
    const [allProjects, allEmployees, allTeams] = await Promise.all([
      Project.find().select("title type requiredSkills startDate endDate assignedTeams").populate({
        path: "assignedTeams",
        select: "name members",
        populate: {
          path: "members",
          select: "name employeeId"
        }
      }).lean(),
      User.find({ role: "employee" }).select("name employeeId skills").lean(),
      Team.find().select("name members").populate({
        path: "members",
        select: "name employeeId"
      }).lean()
    ]);
    globalContext = { projects: allProjects, employees: allEmployees, teams: allTeams };
  }

  return { projectContext, employeeContext, employeeProjects, globalContext };
};