import { getProjectWithDetails } from "../../../services/project.service.js";
import { findEmployeeByIdentifier, getProjectsForEmployee } from "../../../services/employee.service.js";
import type { AdminAgentState } from "../state.js";

export const gatherQaContext = async (state: typeof AdminAgentState.State) => {
  const [projectContext, employeeContext] = await Promise.all([
    state.projectId ? getProjectWithDetails(state.projectId) : Promise.resolve(undefined),
    state.employeeIdentifier ? findEmployeeByIdentifier(state.employeeIdentifier) : Promise.resolve(undefined),
  ]);

  const employeeProjects = employeeContext
    ? await getProjectsForEmployee(employeeContext._id.toString())
    : undefined;
  return { projectContext, employeeContext, employeeProjects };
};
