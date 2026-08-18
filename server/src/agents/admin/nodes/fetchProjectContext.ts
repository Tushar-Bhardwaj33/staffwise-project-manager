import { getProjectWithDetails } from "../../../services/project.service.js";
import type { AdminAgentState } from "../state.js";

export const fetchProjectContext = async (state: typeof AdminAgentState.State) => {
 if (!state.projectId) {
 return { response: "Missing projectId; cannot fetch project context." };
 }
 try {
 const project = await getProjectWithDetails(state.projectId);
 if (!project) {
 return { response: `Project ${state.projectId} not found.` };
 }
 return { projectContext: project };
 } catch (err) {
 return { response: `Failed to fetch project context: ${(err as Error).message}` };
 }
};
