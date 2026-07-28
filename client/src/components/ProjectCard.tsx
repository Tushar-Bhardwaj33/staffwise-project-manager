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
    <div className="group bg-white border border-[#e3e8ee] rounded-xl p-5 hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <ProjectTypeBadge type={project.type} />
        {needsTeam && (
          <span className="text-xs font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
            Needs team
          </span>
        )}
        {teamCount > 0 && (
          <span className="text-xs text-[#9ca3af]">
            {teamCount} team{teamCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Title & description */}
      <div>
        <Link
          to={`/projects/${project._id}`}
          className="font-semibold text-[#0f1419] hover:text-[#0284c7] transition-colors line-clamp-2 text-base leading-snug"
        >
          {project.title}
        </Link>
        <p className="mt-1 text-sm text-[#5b6b79] line-clamp-2">{project.description}</p>
      </div>

      {/* Skills */}
      {project.requiredSkills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.requiredSkills.slice(0, 4).map((s) => (
            <SkillTag key={s} skill={s} />
          ))}
          {project.requiredSkills.length > 4 && (
            <span className="text-xs text-[#9ca3af]">+{project.requiredSkills.length - 4} more</span>
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
          className="text-sm font-medium text-[#0284c7] hover:underline"
        >
          View details →
        </Link>
        {showManage && isAdmin && (
          <Link
            to={`/admin/projects/${project._id}/manage`}
            className="ml-auto text-xs font-medium text-[#9ca3af] hover:text-[#0f1419] border border-[#e3e8ee] rounded-lg px-2.5 py-1 hover:border-[#0284c7] transition-colors"
          >
            Manage
          </Link>
        )}
      </div>
    </div>
  );
}