import type { IProject } from "../../../types/project.type";
import type { ITeam } from "../../../types/team.type";
import type { IUser } from "../../../types/user.type";
import { SkillTag } from "../../../components/ui/SkillTag";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/useAuth";

interface Props { project: IProject }

export default function TeamTab({ project }: Props) {
  const { user } = useAuth();
  const teams = project.assignedTeams ?? [];

  if (teams.length === 0) {
    return (
      <EmptyState
        title="No teams assigned"
        description="This project hasn't been staffed yet."
        action={
          user?.role === "admin" ? (
            <Link
              to={`/admin/projects/${project._id}/manage`}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Assign a team →
            </Link>
          ) : undefined
        }
      />
    );
  }

  return (
    <div className="space-y-5">
      {teams.map((team) => {
        const t = team as ITeam;
        if (!t) return null;
        
        return (
          <div key={t._id} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">{t.name}</h2>
              {user?.role === "admin" && (
                <Link
                  to={`/admin/teams/${t._id}`}
                  className="text-xs text-blue-600 hover:underline"
                >
                  Manage team →
                </Link>
              )}
            </div>
            {!t.members || t.members.length === 0 ? (
              <p className="text-sm text-gray-500">No members in this team.</p>
            ) : (
              <div className="space-y-2">
                {t.members.map((member) => {
                  const m = member as IUser;
                  if (!m || typeof m !== "object") return null;
                  return (
                    <div key={m._id} className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                        {m.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.email} · ID: {m.employeeId}</p>
                      </div>
                      {m.skills?.length > 0 && (
                        <div className="hidden sm:flex flex-wrap gap-1">
                          {m.skills.slice(0, 3).map((s) => (
                            <SkillTag key={s} skill={s} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}