import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import api from "../services/api";
import { PageHeader } from "../components/ui/PageHeader";
import { Spinner } from "../components/ui/Spinner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIAssistant() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        user?.role === "admin"
          ? "Hi! I can help you with staffing suggestions — ask me who would be a good fit for a project, or for insights on your team's skills and history."
          : "Hi! I can answer questions about your projects, team assignments, and work history. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const q = input.trim();
    if (!q || loading) return;

    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await api.post<{ response: string }>("ai/query", { query: q });
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Sorry, I couldn't process that. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen p-6 max-w-3xl mx-auto">
      <PageHeader
        title="AI Assistant"
        subtitle={
          user?.role === "admin"
            ? "Staffing suggestions and team insights"
            : "Ask about your projects and history"
        }
      />

      {/* Chat window */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                m.role === "user"
                  ? "bg-[#20beff] text-white"
                  : "bg-[#e3e8ee] text-[#5b6b79]"
              }`}
            >
              {m.role === "user" ? user?.name?.charAt(0).toUpperCase() : "✦"}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-[#20beff] text-white rounded-tr-sm"
                  : "bg-white border border-[#e3e8ee] text-[#0f1419] rounded-tl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e3e8ee] text-xs font-bold text-[#5b6b79]">
              ✦
            </div>
            <div className="bg-white border border-[#e3e8ee] rounded-2xl rounded-tl-sm px-4 py-3">
              <Spinner size="sm" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-2 border-t border-[#e3e8ee] pt-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Ask something… (Enter to send, Shift+Enter for new line)"
          className="flex-1 resize-none rounded-xl border border-[#e3e8ee] bg-white px-4 py-3 text-sm text-[#0f1419] placeholder-[#9ca3af] focus:border-[#20beff] focus:outline-none focus:ring-1 focus:ring-[#20beff]"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          className="self-end rounded-xl bg-[#20beff] px-4 py-3 text-sm font-semibold text-white hover:bg-[#0f9fdb] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
}
