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
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#20beff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f9fdb] transition-colors"
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
          className="flex-1 rounded-lg border border-[#e3e8ee] bg-white px-4 py-2 text-sm text-[#0f1419] placeholder-[#9ca3af] focus:border-[#20beff] focus:outline-none focus:ring-1 focus:ring-[#20beff]"
        />
        <div className="flex gap-1.5 flex-wrap">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                typeFilter === f.value
                  ? "bg-[#20beff] text-white"
                  : "bg-white border border-[#e3e8ee] text-[#5b6b79] hover:border-[#20beff] hover:text-[#20beff]"
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
                className="text-sm text-[#20beff] hover:underline"
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