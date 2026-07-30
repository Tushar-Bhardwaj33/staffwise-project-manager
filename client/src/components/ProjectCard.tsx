import { Link } from "react-router-dom";
import type { IProject } from "../types/project.type";
import { ProjectTypeBadge } from "./ui/Badge";
import { SkillTag } from "./ui/SkillTag";
import { ProgressBar } from "./ui/ProgressBar";
import { useAuth } from "../context/useAuth";

interface ProjectCardProps {
  project: IProject;
  showManage?: boolean;
}

export function ProjectCard({ project, showManage = false }: ProjectCardProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const teamCount = project.assignedTeams?.length ?? 0;
  const needsTeam = isAdmin && teamCount === 0;

  return (
    <div 
      className="group bg-white/70 backdrop-blur-sm border border-white/40 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden"
      style={{
        borderLeftWidth: project.color ? '6px' : '1px',
        borderLeftColor: project.color || undefined,
      }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-bl-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <ProjectTypeBadge type={project.type} />
        {needsTeam && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
            Needs team
          </span>
        )}
        {teamCount > 0 && (
          <span className="text-xs text-gray-500">
            {teamCount} team{teamCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Title & description */}
      <div>
        <Link
          to={`/projects/${project._id}`}
          className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-base leading-snug"
        >
          {project.title}
        </Link>
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{project.description}</p>
      </div>

      {/* Skills */}
      {project.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.requiredSkills.slice(0, 4).map((s) => (
            <SkillTag key={s} skill={s} />
          ))}
          {project.requiredSkills.length > 4 && (
            <span className="text-xs text-gray-500">+{project.requiredSkills.length - 4} more</span>
          )}
        </div>
      )}

      {/* Timeline */}
      {project.startDate && project.endDate && (
        <ProgressBar startDate={project.startDate} endDate={project.endDate} />
      )}

      {/* Footer actions */}
      <div className="flex items-center gap-2 pt-1 mt-auto">
        <Link
          to={`/projects/${project._id}`}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          View details →
        </Link>
        {showManage && isAdmin && (
          <Link
            to={`/admin/projects/${project._id}/manage`}
            className="ml-auto text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 rounded-lg px-2.5 py-1 hover:border-blue-600 transition-colors"
          >
            Manage
          </Link>
        )}
      </div>
    </div>
  );
}