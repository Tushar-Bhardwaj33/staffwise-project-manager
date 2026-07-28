// server/src/agents/admin/nodes/qa.ts
import { adminLLM } from "../../shared/llmClient.js";
import type { AdminAgentState } from "../state.js";

const buildContextBlock = (state: any) => {
  const parts: string[] = [];

  if (state.projectContext) {
    const p = state.projectContext;
    parts.push(
      `Project "${p.title}" (${p.type}): ${p.description}\n` +
      `Required skills: ${p.requiredSkills.join(", ")}\n` +
      `Timeline: ${new Date(p.startDate).toDateString()} → ${new Date(p.endDate).toDateString()}\n` +
      `Assigned teams: ${p.assignedTeams.map((t: any) => t.name).join(", ") || "none"}`
    );
  }

  if (state.employeeContext) {
    const e = state.employeeContext;
    parts.push(`Employee ${e.name} (ID: ${e.employeeId}): skills — ${e.skills.join(", ") || "none listed"}`);
  }

  if (state.employeeProjects?.length) {
    parts.push(`This employee's current projects: ${state.employeeProjects.map((p: any) => p.title).join(", ")}`);
  }

  return parts.length ? parts.join("\n\n") : "No specific project or employee context was provided.";
};

export const qa: typeof AdminAgentState.Node = async (state) => {
  const result = await adminLLM.invoke([
    {
      role: "system",
      content: "You answer an admin's questions about Staffwise projects and employees using only the context given. If the context doesn't contain the answer, say so plainly rather than guessing.",
    },
    { role: "user", content: `Context:\n${buildContextBlock(state)}\n\nQuestion: ${state.query}` },
  ]);
  return { response: result.content as string };
};