import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllProjects } from "../../services/project.service";
import type { IProject, ProjectType } from "../../types/project.type";
import { ProjectCard } from "../../components/ProjectCard";
import { PageSpinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { useAuth } from "../../context/useAuth";

const TYPE_FILTERS: { label: string; value: ProjectType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Personal", value: "personal" },
  { label: "Company", value: "company" },
  { label: "Product", value: "product" },
  { label: "Client", value: "client" },
];

export default function ProjectList() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ProjectType | "all">("all");

  useEffect(() => {
    getAllProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    return matchSearch && matchType;
  });

  if (loading) return <PageSpinner />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader
        title="Projects"
        subtitle={`${filtered.length} project${filtered.length !== 1 ? "s" : ""}`}
        action={
          user?.role === "admin" ? (
            <Link
              to="/admin/projects/new"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              + New project
            </Link>
          ) : undefined
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title…"
          className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="flex gap-1.5 flex-wrap">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                typeFilter === f.value
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-900 hover:text-gray-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No projects found"
          description={search ? `No results for "${search}"` : "No projects match the current filter."}
          action={
            search || typeFilter !== "all" ? (
              <button
                onClick={() => { setSearch(""); setTypeFilter("all"); }}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProjectCard key={p._id} project={p} showManage={user?.role === "admin"} />
          ))}
        </div>
      )}
    </div>
  );
}