import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { getUserHistory } from "../services/users.services";
import { getAllProjects } from "../services/project.service";
import type { IProject } from "../types/project.type";
import { ProjectCard } from "../components/ProjectCard";
import { HistoryCard } from "../components/HistoryCard";
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

  const myAssignedProjects = allProjects.filter((p) => {
    return p.assignedTeams?.some((team: any) =>
      team.members?.some((m: any) =>
        m.toString() === user?._id || (m._id && m._id.toString() === user?._id)
      )
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader title="My Projects" subtitle="Your assignments and history" />

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "assigned" && (
        <>
          {myAssignedProjects.length === 0 ? (
            <EmptyState
              title="No active projects"
              description="You haven't been assigned to any project teams yet."
              action={
                <Link to="/projects" className="text-sm text-blue-600 hover:underline">
                  Browse open projects →
                </Link>
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myAssignedProjects.map((p) => (
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
                <HistoryCard key={p._id} project={p} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
