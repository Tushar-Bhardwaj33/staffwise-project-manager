import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProjectById, assignTeamToProject, removeTeamFromProject } from "../../services/project.service";
import { getAllTeams } from "../../services/team.service";
import { getProjectPreferences } from "../../services/prefrences.service";
import type { IProject } from "../../types/project.type";
import type { ITeam } from "../../types/team.type";
import type { IPreference } from "../../services/prefrences.service";
import { PageSpinner } from "../../components/ui/Spinner";
import { PageHeader } from "../../components/ui/PageHeader";
import { ProjectTypeBadge } from "../../components/ui/Badge";
import { SkillTag } from "../../components/ui/SkillTag";

export default function ManageProject() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<IProject | null>(null);
  const [allTeams, setAllTeams] = useState<ITeam[]>([]);
  const [preferences, setPreferences] = useState<IPreference[]>([]);
  const [loading, setLoading] = useState(true);
  const [prefTab, setPrefTab] = useState<"interested" | "not-interested">("interested");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getProjectById(id),
      getAllTeams(),
      getProjectPreferences(id).catch(() => []),
    ])
      .then(([proj, teams, prefs]) => {
        setProject(proj);
        setAllTeams(teams);
        setPreferences(prefs);
      })
      .catch(() => navigate("/projects"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const assignedTeamIds = new Set(
    (project?.assignedTeams ?? []).map((t) => (typeof t === "string" ? t : (t as ITeam)._id))
  );
  const unassignedTeams = allTeams.filter((t) => !assignedTeamIds.has(t._id));

  const handleAssign = async (teamId: string) => {
    if (!project) return;
    try {
      const updated = await assignTeamToProject(project._id, teamId);
      setProject(updated);
    } catch {
      alert("Failed to assign team.");
    }
  };

  const handleUnassign = async (teamId: string) => {
    if (!project || !confirm("Remove this team from the project?")) return;
    try {
      const updated = await removeTeamFromProject(project._id, teamId);
      setProject(updated);
    } catch {
      alert("Failed to unassign team.");
    }
  };

  if (loading) return <PageSpinner />;
  if (!project) return null;

  const assignedTeams = (project.assignedTeams ?? []) as ITeam[];
  const filteredPrefs = preferences.filter((p) => p.interest === prefTab);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(`/projects/${project._id}`)}
        className="mb-4 text-sm text-[#9ca3af] hover:text-[#0f1419] flex items-center gap-1"
      >
        ← Back to project
      </button>

      <div className="flex items-start gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ProjectTypeBadge type={project.type} />
          </div>
          <PageHeader title={`Manage: ${project.title}`} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Teams */}
        <div className="space-y-5">
          {/* Assigned teams */}
          <div className="bg-white border border-[#e3e8ee] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#0f1419] mb-3">
              Assigned teams ({assignedTeams.length})
            </h2>
            {assignedTeams.length === 0 ? (
              <p className="text-sm text-[#9ca3af]">No teams assigned yet.</p>
            ) : (
              <div className="space-y-2">
                {assignedTeams.map((team) => (
                  <div key={team._id} className="flex items-center gap-3 rounded-lg bg-[#f7f9fb] px-4 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e8f5fe] text-[#0284c7] font-bold text-sm">
                      ◉
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0f1419]">{team.name}</p>
                      <p className="text-xs text-[#9ca3af]">
                        {(team.members?.length ?? 0)} member{(team.members?.length ?? 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUnassign(team._id)}
                      className="text-xs text-red-400 hover:text-red-600 shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available teams */}
          <div className="bg-white border border-[#e3e8ee] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#0f1419] mb-3">
              Available teams ({unassignedTeams.length})
            </h2>
            {unassignedTeams.length === 0 ? (
              <p className="text-sm text-[#9ca3af]">
                All teams are already assigned.{" "}
                <Link to="/admin/teams" className="text-[#20beff] hover:underline">Create a new team →</Link>
              </p>
            ) : (
              <div className="space-y-2">
                {unassignedTeams.map((team) => (
                  <div key={team._id} className="flex items-center gap-3 rounded-lg px-4 py-2.5 hover:bg-[#f7f9fb]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#e3e8ee] text-[#5b6b79] font-bold text-sm">
                      ◉
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#0f1419]">{team.name}</p>
                      <p className="text-xs text-[#9ca3af]">
                        {(team.members?.length ?? 0)} member{(team.members?.length ?? 0) !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAssign(team._id)}
                      className="text-xs font-medium text-[#20beff] hover:underline shrink-0"
                    >
                      + Assign
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Preferences */}
        <div className="bg-white border border-[#e3e8ee] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#0f1419] mb-3">
            Employee preferences ({preferences.length})
          </h2>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-[#e3e8ee] mb-4">
            {(["interested", "not-interested"] as const).map((tab) => {
              const count = preferences.filter((p) => p.interest === tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setPrefTab(tab)}
                  className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors ${
                    prefTab === tab
                      ? "border-[#20beff] text-[#0284c7]"
                      : "border-transparent text-[#9ca3af] hover:text-[#0f1419]"
                  }`}
                >
                  {tab === "interested" ? "✓ Interested" : "✗ Not interested"} ({count})
                </button>
              );
            })}
          </div>

          {filteredPrefs.length === 0 ? (
            <p className="text-sm text-[#9ca3af] py-4 text-center">No responses yet.</p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredPrefs.map((pref) => {
                const emp = pref.employee;
                const name = typeof emp === "object" ? emp.name : "Employee";
                const eid = typeof emp === "object" ? emp.employeeId : "";
                const empSkills = typeof emp === "object" ? emp.skills ?? [] : [];
                return (
                  <div key={pref._id} className="rounded-lg bg-[#f7f9fb] px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#20beff] text-white text-xs font-bold">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-medium text-[#0f1419]">{name}</p>
                      <span className="text-xs text-[#9ca3af] font-mono">#{eid}</span>
                    </div>
                    {empSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-1.5">
                        {empSkills.slice(0, 4).map((s) => <SkillTag key={s} skill={s} />)}
                      </div>
                    )}
                    {pref.reason && (
                      <p className="text-xs text-[#5b6b79] italic">"{pref.reason}"</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}