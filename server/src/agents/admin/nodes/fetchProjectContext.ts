import { getProjectWithDetails } from "../../../services/project.service.js";
import type { AdminAgentState } from "../state.js";

export const fetchProjectContext = async (state: typeof AdminAgentState.State) => {
  const project = await getProjectWithDetails(state.projectId as string);
  return { projectContext: project };
};