import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";
import { AssistantRuntimeProvider, useAui, Tools, unstable_Interactables } from "@assistant-ui/react";
import { useChat } from "@ai-sdk/react";
import { useAISDKRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "../../../components/assistant-ui/thread";
import { staffwiseToolkit } from "../../../components/ui/Toolkits";
import { ProjectNotepad } from "../../../components/ui/ProjectNotepad";

// Module-level persistence adapter for project notes
const persistenceAdapter = {
  load: () => {
    const saved = localStorage.getItem("staffwise_interactables");
    return saved ? JSON.parse(saved) : undefined;
  },
  save: (state: any) => {
    localStorage.setItem("staffwise_interactables", JSON.stringify(state));
  },
};

export default function AITab() {
  const { id } = useParams();
  const { user } = useAuth();

  const endpoint = user?.role === "admin" ? "ai/admin/qa" : "ai/query";
  const apiUrl = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/${endpoint}`;

  const chat = useChat({
    api: apiUrl,
    body: { projectId: id },
    fetch: (input: RequestInfo | URL, init?: RequestInit) => 
      fetch(input, { ...init, credentials: "include" }),
  } as any);
  const runtime = useAISDKRuntime(chat);

  const aui = useAui({
    tools: Tools({ toolkit: staffwiseToolkit }),
    unstable_interactables: unstable_Interactables({ persistence: persistenceAdapter }),
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col h-[600px]">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Project AI Assistant</h2>
      <div className="flex-1 flex gap-4 overflow-hidden">
        <div className="flex-1 border border-gray-100 rounded-lg bg-gray-50/50">
          <AssistantRuntimeProvider aui={aui} runtime={runtime}>
            <Thread />
          </AssistantRuntimeProvider>
        </div>
        <div className="flex-1">
          {id && <ProjectNotepad projectId={id} />}
        </div>
      </div>
    </div>
  );
}
