import React from "react";
import { unstable_useInteractable } from "@assistant-ui/react";
import { z } from "zod";

export const projectNotesSchema = z.object({
  title: z.string().describe("The title of the project notes"),
  content: z.string().describe("The rich content or bullets of the notes"),
  status: z.enum(["draft", "active", "completed"]).describe("Current status of the project notes"),
});

export type ProjectNotesState = z.infer<typeof projectNotesSchema>;

export function ProjectNotepad({ projectId }: { projectId: string }) {
  const [state, { setState, isPending }] = unstable_useInteractable("projectNotes", {
    id: projectId,
    description: "A collaborative project notepad where the AI and user can draft notes, requirements, and tasks.",
    stateSchema: projectNotesSchema,
    initialState: { title: "New Project Notes", content: "", status: "draft" },
  });

  return (
    <div className="flex flex-col h-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <input 
          type="text"
          value={state.title}
          onChange={(e) => setState((s: ProjectNotesState) => ({ ...s, title: e.target.value }))}
          className="text-lg font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 px-0 w-full"
        />
        <div className="flex items-center gap-2">
          {isPending && <span className="text-xs text-gray-500 animate-pulse">Saving...</span>}
          <select 
            value={state.status}
            onChange={(e) => setState((s: ProjectNotesState) => ({ ...s, status: e.target.value as any }))}
            className="text-xs rounded-full px-2 py-1 border border-gray-200 bg-white"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="flex-1 p-0">
        <textarea
          value={state.content}
          onChange={(e) => setState((s: ProjectNotesState) => ({ ...s, content: e.target.value }))}
          placeholder="Start typing project notes here... The AI can also edit this!"
          className="w-full h-full p-4 resize-none border-none outline-none focus:ring-0 text-gray-700 leading-relaxed"
        />
      </div>
    </div>
  );
}
