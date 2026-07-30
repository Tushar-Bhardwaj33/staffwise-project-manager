import { useAuth } from "../context/useAuth";
import { PageHeader } from "../components/ui/PageHeader";
import { AssistantRuntimeProvider, useAui, Tools } from "@assistant-ui/react";
import { useChat } from "@ai-sdk/react";
import { useAISDKRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "../components/assistant-ui/thread";
import { staffwiseToolkit } from "../components/ui/Toolkits";

export default function AIAssistant() {
  const { user } = useAuth();
  
  const endpoint = user?.role === "admin" ? "ai/admin/qa" : "ai/query";
  const apiUrl = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/${endpoint}`;

  const chat = useChat({
    api: apiUrl,
    fetch: (input: RequestInfo | URL, init?: RequestInit) => 
      fetch(input, { ...init, credentials: "include" }),
  } as any);
  const runtime = useAISDKRuntime(chat);

  const aui = useAui({
    tools: Tools({ toolkit: staffwiseToolkit }),
  });

  return (
    <div className="flex flex-col h-screen max-h-screen p-6 max-w-3xl mx-auto">
      {/* <PageHeader
        title="AI Assistant"
        // subtitle={
        //   user?.role === "admin"
        //     ? "Staffing suggestions and team insights"
        //     : "Ask about your projects and history"
        // }
      /> */}

      <div className="flex-1 overflow-hidden border border-gray-200 rounded-xl bg-white shadow-sm mt-4">
        <AssistantRuntimeProvider aui={aui} runtime={runtime}>
          <Thread />
        </AssistantRuntimeProvider>
      </div>
    </div>
  );
}
