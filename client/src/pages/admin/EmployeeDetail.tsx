import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserById, updateRole, getUserHistory } from "../../services/users.services";
import type { IUser } from "../../types/user.type";
import type { IProject } from "../../types/project.type";
import { PageSpinner } from "../../components/ui/Spinner";
import { PageHeader } from "../../components/ui/PageHeader";
import { SkillTag } from "../../components/ui/SkillTag";
import { RoleBadge } from "../../components/ui/Badge";
import { ProjectCard } from "../../components/ProjectCard";
import { EmptyState } from "../../components/ui/EmptyState";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { useAuth } from "../../context/useAuth";

export default function EmployeeDetail() {
  const { user: currentUser } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [history, setHistory] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [showConfirmToggle, setShowConfirmToggle] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      getUserById(id),
      getUserHistory(id).catch(() => []),
    ])
      .then(([u, hist]) => {
        setUser(u);
        setHistory(hist as IProject[]);
      })
      .catch(() => navigate("/admin/employees"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleRoleToggle = async () => {
    if (!user) return;
    const newRole = user.role === "admin" ? "employee" : "admin";
    setToggling(true);
    try {
      await updateRole(user._id, newRole);
      setUser({ ...user, role: newRole });
    } catch {
      alert("Failed to update role.");
    } finally {
      setToggling(false);
      setShowConfirmToggle(false);
    }
  };

  if (loading) return <PageSpinner />;
  if (!user) return null;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/admin/employees")}
        className="mb-4 text-sm text-[#9ca3af] hover:text-[#0f1419] flex items-center gap-1"
      >
        ← Back to employees
      </button>
      <PageHeader title={user.name} subtitle={user.email} />

      {/* Profile card */}
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#20beff] text-white text-2xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-semibold text-[#0f1419]">{user.name}</p>
            <p className="text-sm text-[#9ca3af]">{user.email}</p>
            <div className="mt-1 flex items-center gap-2">
              <RoleBadge role={user.role} />
              <span className="text-xs text-[#9ca3af]">ID: {user.employeeId}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-lg bg-[#f7f9fb] p-4 mb-6 text-sm">
          <div>
            <p className="text-xs text-[#9ca3af] font-medium uppercase tracking-wide">Employee ID</p>
            <p className="mt-0.5 font-mono text-[#0f1419]">{user.employeeId}</p>
          </div>
          <div>
            <p className="text-xs text-[#9ca3af] font-medium uppercase tracking-wide">Current role</p>
            <p className="mt-0.5 capitalize text-[#0f1419]">{user.role}</p>
          </div>
          <div>
            <p className="text-xs text-[#9ca3af] font-medium uppercase tracking-wide">Member since</p>
            <p className="mt-0.5 text-[#0f1419]">
              {new Date(user.createdAt).toLocaleDateString("en-US", { dateStyle: "medium" })}
            </p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#0f1419] mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {user.skills?.length > 0
              ? user.skills.map((s) => <SkillTag key={s} skill={s} />)
              : <span className="text-sm text-[#9ca3af]">No skills listed</span>
            }
          </div>
        </div>

        {/* Role toggle (hidden if viewing self) */}
        {currentUser?._id !== user._id && (
          <div className="border-t border-[#e3e8ee] pt-4">
            <p className="text-sm text-[#5b6b79] mb-3">
              {user.role === "admin"
                ? "This employee has admin privileges. Demote them to remove admin access."
                : "Promote this employee to give them admin access."}
            </p>
            <button
              onClick={() => setShowConfirmToggle(true)}
              disabled={toggling}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
                user.role === "admin"
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200"
              }`}
            >
              {toggling
                ? "Updating…"
                : user.role === "admin"
                ? "Demote to Employee"
                : "Promote to Admin"}
            </button>
          </div>
        )}
      </div>

      {/* Project history */}
      <div>
        <p className="text-sm font-semibold text-[#0f1419] mb-3">Project history</p>
        {history.length === 0 ? (
          <EmptyState title="No project history" description="This employee hasn't been on any projects yet." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {history.map((p) => <ProjectCard key={p._id} project={p} />)}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirmToggle}
        title="Change Role"
        message={`Are you sure you want to change ${user?.name}'s role to ${user?.role === "admin" ? "employee" : "admin"}?`}
        confirmText="Change Role"
        isDestructive={user?.role === "admin"}
        onConfirm={handleRoleToggle}
        onCancel={() => setShowConfirmToggle(false)}
      />
    </div>
  );
}
