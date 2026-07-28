// server/src/agents/admin/nodes/summarize.ts
import { adminLLM } from "../../shared/llmClient.js";
import type { AdminAgentState } from "../state.js";

const buildPrompt = (projectContext: any, query: string) => `
Project: ${projectContext.title}
Type: ${projectContext.type}
Description: ${projectContext.description}
Required skills: ${projectContext.requiredSkills.join(", ")}
Timeline: ${new Date(projectContext.startDate).toDateString()} → ${new Date(projectContext.endDate).toDateString()}
Assigned teams: ${projectContext.assignedTeams.map((t: any) => t.name).join(", ") || "none yet"}

Admin's request: "${query}"

Write a concise summary of this project for the admin.
`.trim();

export const summarize: typeof AdminAgentState.Node = async (state) => {
  const result = await adminLLM.invoke([
    { role: "system", content: "You summarize staffing projects for admins clearly and concisely." },
    { role: "user", content: buildPrompt(state.projectContext, state.query) },
  ]);
  return { response: result.content as string };
};