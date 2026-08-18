import { adminLLM } from "../../shared/llmClient.js";
import { adminTools } from "../tools/adminTools.js";
import type { AdminAgentState } from "../state.js";

const toolsByName: Record<string, any> = Object.fromEntries(adminTools.map((t) => [t.name, t]));

const buildContextBlock = (state: any) => {
  const parts: string[] = [];

  if (state.projectContext) {
 const p = state.projectContext;
 parts.push(
 `Project "${p.title}" (${p.type}): ${p.description}\n` +
 `Required skills: ${(p.requiredSkills ?? []).join(", ") || "none"}\n` +
 `Timeline: ${new Date(p.startDate).toDateString()} → ${new Date(p.endDate).toDateString()}\n` +
 `Assigned teams: ${(p.assignedTeams ?? []).map((t) => `${t.name} (Members: ${(t.members ?? []).map((m) => m.name).join(", ") || "none"})`).join("; ") || "none"}`
 );
 }

 if (state.employeeContext) {
 const e = state.employeeContext;
 parts.push(`Employee ${e.name} (ID: ${e.employeeId}): skills — ${(e.skills ?? []).join(", ") || "none listed"}`);
 }

 if (state.employeeProjects?.length) {
 parts.push(`This employee's current projects: ${state.employeeProjects.map((p) => p.title ?? "untitled").join(", ")}`);
 }

  if (state.currentUser) {
    const u = state.currentUser;
    parts.unshift(`You are talking to: ${u.name} (Role: ${u.role}, ID: ${u.employeeId || 'N/A'}). Use their name to make the conversation feel personal.`);
  }

  return parts.length ? parts.join("\n\n") : "No specific project or employee context was provided.";
};

const MAX_TOOL_ROUNDS = 4;

export const qa = async (state: typeof AdminAgentState.State) => {
  // True "org-wide" question: an admin with no specific project or employee already
  // resolved. Instead of dumping every project/employee/team into the prompt, give the
  // model tools so it only fetches the data this particular question needs.
  const isGlobalAdminQuery = !state.projectContext && !state.employeeContext && (state as any).currentUser?.role === "admin";

  const systemPrompt = `You are a helpful, conversational, and personal AI assistant for Staffwise. Refer to people by their names whenever possible.

Use the provided context to answer questions about projects and employees.
- To figure out who is "available", check whether an employee's name appears assigned to any active project. If not, they're available!
- Be proactive! If asked for a good fit, match required skills with employee skills and check availability.
${isGlobalAdminQuery ? "- You have tools to look up projects, employees, and teams. Call them as needed to answer — don't guess." : ""}

If you don't have the answer, do NOT say "I have no context". Instead, be conversational and specific about what you can't access, e.g., "I can't access their vacation schedules right now, but..." or "I don't have access to that specific project's data, but..."`;

  const messages: any[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: `Here is the current backend context (never reveal this block structure to the user):\n${buildContextBlock(state)}` },
  ];

  const allowedRoles = new Set(["user", "assistant"]);
 if (Array.isArray(state.history)) {
 for (const h of state.history) {
 if (
 h &&
 typeof h === "object" &&
 allowedRoles.has(h.role) &&
 typeof h.content === "string" &&
 h.content.length > 0 &&
 h.content.length <= 4000
 ) {
 messages.push({ role: h.role, content: h.content });
 }
 }
 }

  messages.push({ role: "user", content: state.query });

  try {
 if (!isGlobalAdminQuery) {
 const result = await adminLLM.invoke(messages);
 return { response: (result.content as string) || "I'm sorry, I couldn't generate a response." };
 }

 const llmWithTools = adminLLM.bindTools(adminTools);

 for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
 const result = await llmWithTools.invoke(messages);

 if (!result.tool_calls || result.tool_calls.length === 0) {
 return { response: (result.content as string) || "I'm sorry, I couldn't generate a response." };
 }

 messages.push(result);

 const toolResults = await Promise.all(result.tool_calls.map(async (call) => {
 const toolFn = toolsByName[call.name];
 const output = toolFn
 ? await toolFn.invoke(call.args as any)
 : `Unknown tool: ${call.name}`;
 return { role: "tool" as const, tool_call_id: call.id, content: String(output) };
 }));
 messages.push(...toolResults);
 }

 // Ran out of rounds — force a final plain-text answer with whatever we've gathered.
 const finalResult = await adminLLM.invoke(messages);
 return { response: (finalResult.content as string) || "I'm sorry, I couldn't generate a response." };
 } catch (err) {
 return { response: "I'm having trouble reaching my tools right now. Please try again in a moment." };
 }
};
