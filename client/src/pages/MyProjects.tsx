import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { getUserHistory } from "../services/users.services";
import { getAllProjects } from "../services/project.service";
import type { IProject } from "../types/project.type";
import { ProjectCard } from "../components/ProjectCard";
import { PageSpinner } from "../components/ui/Spinner";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";
import { Link } from "react-router-dom";

export default function MyProjects() {
  const { user } = useAuth();
  const [history, setHistory] = useState<IProject[]>([]);
  const [allProjects, setAllProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"assigned" | "history">("assigned");

  useEffect(() => {
    if (!user) return;
    Promise.all([
      getUserHistory(user._id).catch(() => []),
      getAllProjects().catch(() => []),
    ])
      .then(([hist, projects]) => {
        setHistory(hist as IProject[]);
        setAllProjects(projects);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <PageSpinner />;

  const tabs = [
    { key: "assigned", label: "Current projects" },
    { key: "history", label: "Project history" },
  ] as const;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title="My Projects" subtitle="Your assignments and history" />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[#e3e8ee] mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? "border-[#20beff] text-[#0284c7]"
                : "border-transparent text-[#9ca3af] hover:text-[#0f1419]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "assigned" && (
        <>
          {allProjects.length === 0 ? (
            <EmptyState
              title="No active projects"
              description="You haven't been assigned to any project teams yet."
              action={
                <Link to="/projects" className="text-sm text-[#20beff] hover:underline">
                  Browse open projects →
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allProjects.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === "history" && (
        <>
          {history.length === 0 ? (
            <EmptyState
              title="No project history yet"
              description="Completed and past projects will appear here."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {history.map((p) => (
                <ProjectCard key={p._id} project={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
