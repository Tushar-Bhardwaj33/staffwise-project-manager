import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProjectById } from "../../services/project.service";
import type { IProject } from "../../types/project.type";
import { PageSpinner } from "../../components/ui/Spinner";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../context/useAuth";
import clsx from "clsx";

import OverviewTab from "./tabs/OverviewTab";
import DocumentsTab from "./tabs/DocumentsTab";
import DiscussionTab from "./tabs/DiscussionTab";
import TeamTab from "./tabs/TeamTab";
import AITab from "./tabs/AITab";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "documents", label: "Documents" },
  { id: "discussion", label: "Discussion" },
  { id: "team", label: "Team" },
  { id: "ai", label: "AI Assistant" },
];

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!id) return;
    getProjectById(id)
      .then(setProject)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageSpinner />;
  if (!project) return <div className="p-8 text-center text-gray-500">Project not found</div>;

  const isAssigned =
    user?.role === "admin" ||
    project.assignedTeams?.some((team) =>
      team?.members?.some((member) =>
        typeof member === "string" ? member === user?._id : member._id === user?._id
      )
    );

  const availableTabs = isAssigned ? TABS : TABS.filter((t) => t.id === "overview");

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <div className="mb-6 shrink-0">
        <PageHeader
          title={project.title}
          action={
            user?.role === "admin" ? (
              <Link
                to={`/admin/projects/${project._id}/manage`}
                className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-colors"
              >
                Manage project
              </Link>
            ) : undefined
          }
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 shrink-0">
        <nav className="-mb-px flex gap-6 overflow-x-auto" aria-label="Tabs">
          {availableTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "whitespace-nowrap border-b-2 py-3 px-1 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className={clsx("flex-1", activeTab === "ai" ? "flex flex-col min-h-0" : "overflow-y-auto")}>
        {activeTab === "overview" && <OverviewTab project={project} onProjectUpdate={setProject} />}
        {isAssigned && activeTab === "documents" && <DocumentsTab projectId={project._id} />}
        {isAssigned && activeTab === "discussion" && <DiscussionTab projectId={project._id} />}
        {isAssigned && activeTab === "team" && <TeamTab project={project} />}
        {isAssigned && activeTab === "ai" && <AITab projectId={project._id} projectTitle={project.title} />}
      </div>
    </div>
  );
}