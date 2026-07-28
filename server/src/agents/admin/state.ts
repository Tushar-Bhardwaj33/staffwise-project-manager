// server/src/agents/admin/state.ts (updated — projectId now optional, new employee fields)
import { StateSchema } from "@langchain/langgraph";
import { z } from "zod/v4";

export const AdminAgentState = new StateSchema({
  query: z.string(),
  projectId: z.string().optional(),
  employeeIdentifier: z.string().optional(),
  projectContext: z.any().optional(),
  employeeContext: z.any().optional(),
  employeeProjects: z.any().optional(),
  response: z.string().optional(),
});