import { getProjectWithDetails } from "../../../services/project.service.js";
import type { AdminAgentState } from "../state.js";

export const fetchProjectContext: typeof AdminAgentState.Node = async (state) => {
  const project = await getProjectWithDetails(state.projectId);
  return { projectContext: project };
};