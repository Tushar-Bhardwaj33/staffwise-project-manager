import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { getAllProjects } from "../services/project.service";
import type { IProject } from "../types/project.type";
import { ProjectCard } from "../components/ProjectCard";
import { PageSpinner } from "../components/ui/Spinner";
import { EmptyState } from "../components/ui/EmptyState";
import { PageHeader } from "../components/ui/PageHeader";

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProjects()
      .then(setProjects)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const unassigned = projects.filter((p) => !p.assignedTeams || p.assignedTeams.length === 0);
  
  const employeeProjects = useMemo(() => {
    if (user?.role === "admin") return projects;
    return projects.filter((p) =>
      p.assignedTeams?.some((team: any) =>
        team.members?.some((m: any) =>
          m.toString() === user?._id || (m._id && m._id.toString() === user?._id)
        )
      )
    );
  }, [projects, user]);

  const relevantProjects = user?.role === "admin" ? projects : employeeProjects;
  const recent = relevantProjects.slice(0, 6);

  const stats = useMemo(() => {
    const now = Date.now();
    return {
      total: projects.length, // Always show total system projects
      unassigned: unassigned.length,
      active: relevantProjects.filter((p) => new Date(p.startDate).getTime() <= now && new Date(p.endDate).getTime() >= now).length,
      completed: relevantProjects.filter((p) => new Date(p.endDate).getTime() < now).length,
      assigned: user?.role === "admin"
        ? relevantProjects.filter((p) => p.assignedTeams?.length > 0).length
        : relevantProjects.length,
      upcoming: relevantProjects.filter((p) => new Date(p.startDate).getTime() > now).length,
    };
  }, [relevantProjects, projects, unassigned, user]);

  if (loading) return <PageSpinner />;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0]}`}
        subtitle={user?.role === "admin" ? "Here's what needs your attention" : "Here are your active projects"}
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total projects" value={stats.total} />
        {user?.role === "admin" ? (
          <>
            <StatCard label="Needs team" value={stats.unassigned} highlight={stats.unassigned > 0} />
            <StatCard label="Active" value={stats.active} />
            <StatCard label="Completed" value={stats.completed} />
          </>
        ) : (
          <>
            <StatCard label="Assigned" value={stats.assigned} />
            <StatCard label="Upcoming" value={stats.upcoming} />
            <StatCard label="Completed" value={stats.completed} />
          </>
        )}
      </div>

      {/* Admin: unassigned projects callout */}
      {user?.role === "admin" && unassigned.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              ⚠ Awaiting team assignment
            </h2>
            <Link to="/projects" className="text-xs text-blue-600 hover:underline">View all →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unassigned.slice(0, 3).map((p) => (
              <ProjectCard key={p._id} project={p} showManage />
            ))}
          </div>
        </section>
      )}

      {/* Recent projects */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
            {user?.role === "admin" ? "All projects" : "Your projects"}
          </h2>
          <Link to="/projects" className="text-xs text-blue-600 hover:underline">View all →</Link>
        </div>
        {recent.length === 0 ? (
          <EmptyState title="No projects yet" description="Projects will appear here once they're created." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((p) => (
              <ProjectCard key={p._id} project={p} showManage={user?.role === "admin"} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${highlight ? "bg-gradient-to-br from-amber-500 to-orange-400 text-white shadow-md shadow-orange-500/20 border border-amber-400" : "bg-white/80 backdrop-blur-md border border-white/40 shadow-sm group hover:border-blue-200"}`}>
      {/* Background decoration for highlight */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150 ${highlight ? 'bg-white' : 'bg-blue-600'}`} />
      
      <div className="relative z-10 flex flex-col gap-1">
        <p className={`text-3xl font-black tracking-tight ${highlight ? "text-white" : "text-gray-900 group-hover:text-blue-600 transition-colors"}`}>{value}</p>
        <p className={`text-sm font-medium ${highlight ? "text-amber-100" : "text-gray-500"}`}>{label}</p>
      </div>
    </div>
  );
}
