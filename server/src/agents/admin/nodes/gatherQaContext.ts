import { getProjectWithDetails } from "../../../services/project.service.js";
import { findEmployeeByIdentifier, getProjectsForEmployee } from "../../../services/employee.service.js";
import type { AdminAgentState } from "../state.js";

export const gatherQaContext = async (state: typeof AdminAgentState.State): Promise<Partial<typeof AdminAgentState.State>> => {
 try {
 const [projectContext, employeeContext] = await Promise.all([
 state.projectId ? getProjectWithDetails(state.projectId) : Promise.resolve(undefined),
 state.employeeIdentifier ? findEmployeeByIdentifier(state.employeeIdentifier) : Promise.resolve(undefined),
 ]);

 const employeeProjects = employeeContext
 ? await getProjectsForEmployee(employeeContext._id.toString())
 : undefined;
 return { projectContext, employeeContext, employeeProjects };
 } catch (error) {
 // Surface a structured error to downstream nodes; the caller decides how to react.
 return { qaError: error instanceof Error ? error.message : "Failed to gather QA context" };
 }
};
