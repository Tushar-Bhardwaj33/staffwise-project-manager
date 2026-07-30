import { adminLLM } from "../../shared/llmClient.js";
import type { AdminAgentState } from "../state.js";

const buildPrompt = (state: any) => {
  const { projectContext, query, currentUser } = state;
  let prompt = "";
  
  if (currentUser) {
    prompt += `You are talking to: ${currentUser.name} (Role: ${currentUser.role}). Use their name to make the conversation feel personal.\n\n`;
  }

  prompt += `Project: ${projectContext.title}
Type: ${projectContext.type}
Description: ${projectContext.description}
Required skills: ${projectContext.requiredSkills.join(", ")}
Timeline: ${new Date(projectContext.startDate).toDateString()} → ${new Date(projectContext.endDate).toDateString()}
Assigned teams: ${projectContext.assignedTeams.map((t: any) => `${t.name} (Members: ${(t.members || []).map((m: any) => m.name).join(", ") || "none"})`).join("; ") || "none yet"}

Admin's request: "${query}"

Write a concise, conversational summary of this project for them.`;

  return prompt;
};

export const summarize: typeof AdminAgentState.Node = async (state, config) => {
  const result = await adminLLM.invoke([
    { role: "system", content: "You are a helpful, conversational AI. You summarize staffing projects clearly and concisely, using the person's name to make it personal." },
    { role: "user", content: buildPrompt(state) },
  ], config);
  return { response: result.content as string };
};