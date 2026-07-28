import type { ProjectType } from "../../types/project.type";

const typeStyles: Record<ProjectType, string> = {
  personal:  "bg-violet-100 text-violet-700",
  company:   "bg-blue-100 text-blue-700",
  product:   "bg-emerald-100 text-emerald-700",
  client:    "bg-amber-100 text-amber-700",
};

interface BadgeProps {
  type: ProjectType;
  className?: string;
}

export function ProjectTypeBadge({ type, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${typeStyles[type] ?? "bg-gray-100 text-gray-600"} ${className}`}
    >
      {type}
    </span>
  );
}

interface RoleBadgeProps {
  role: "admin" | "employee";
}

export function RoleBadge({ role }: RoleBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        role === "admin" ? "bg-purple-100 text-purple-700" : "bg-sky-100 text-sky-700"
      }`}
    >
      {role}
    </span>
  );
}