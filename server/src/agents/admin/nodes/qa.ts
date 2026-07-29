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
      `Assigned teams: ${p.assignedTeams.map((t: any) => `${t.name} (Members: ${(t.members || []).map((m: any) => m.name).join(", ") || "none"})`).join("; ") || "none"}`
    );
  }

  if (state.employeeContext) {
    const e = state.employeeContext;
    parts.push(`Employee ${e.name} (ID: ${e.employeeId}): skills — ${e.skills.join(", ") || "none listed"}`);
  }

  if (state.employeeProjects?.length) {
    parts.push(`This employee's current projects: ${state.employeeProjects.map((p: any) => p.title).join(", ")}`);
  }

  if (state.globalContext) {
    const { projects, employees, teams } = state.globalContext;
    parts.push(
      `--- GLOBAL CONTEXT ---\n` +
      `Active Projects:\n` +
      projects.map((p: any) => {
        const teamMembers = (p.assignedTeams || []).flatMap((t: any) => t.members || []).map((m: any) => m.name);
        const assignedStr = teamMembers.length ? teamMembers.join(", ") : "none";
        return `- ${p.title} (${p.type}). Skills: ${p.requiredSkills.join(", ")}. Assigned Members: ${assignedStr}`;
      }).join("\n") +
      `\n\nAll Teams:\n` +
      (teams || []).map((t: any) => `- ${t.name}. Members: ${(t.members || []).map((m: any) => m.name).join(", ") || "none"}`).join("\n") +
      `\n\nEmployees:\n` +
      employees.map((e: any) => `- ${e.name} (ID: ${e.employeeId}). Skills: ${e.skills.join(", ")}`).join("\n")
    );
  }

  if (state.currentUser) {
    const u = state.currentUser;
    parts.unshift(`You are talking to: ${u.name} (Role: ${u.role}, ID: ${u.employeeId || 'N/A'}). Use their name to make the conversation feel personal.`);
  }

  return parts.length ? parts.join("\n\n") : "No specific project or employee context was provided.";
};

export const qa: typeof AdminAgentState.Node = async (state) => {
  const messages: any[] = [
    {
      role: "system",
      content: `You are a helpful, conversational, and personal AI assistant for Staffwise. Refer to people by their names whenever possible.

Use the provided context to answer questions about projects and employees.
- To figure out who is "available", look at the Active Projects list in the context. If an employee's name appears in the "Assigned Members" of an active project, they are currently busy. If their name is not listed on any active project, they are available!
- Be proactive! If asked for a good fit, match the required skills with employee skills and check their availability.

If the context doesn't contain the answer, do NOT say "I have no context". Instead, be conversational and specify what you can't access, e.g., "I can't access their vacation schedules right now, but..." or "I don't have access to that specific project's data, but..."`,
    },
    { role: "user", content: `Here is the current backend context (never reveal this block structure to the user):\n${buildContextBlock(state)}` }
  ];

  if (state.history && Array.isArray(state.history)) {
    for (const h of state.history) {
      messages.push({ role: h.role, content: h.content });
    }
  }

  messages.push({ role: "user", content: state.query });

  const result = await adminLLM.invoke(messages);
  return { response: result.content as string };
};