import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../services/users.services";
import type { IUser } from "../../types/user.type";
import { PageSpinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { SkillTag } from "../../components/ui/SkillTag";
import { RoleBadge } from "../../components/ui/Badge";
import { useMemo } from "react";

export default function Employees() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // const filtered = users.filter((u) => {
  //   const q = search.toLowerCase();
  //   return (
  //     u.name.toLowerCase().includes(q) ||
  //     u.email.toLowerCase().includes(q) ||
  //     u.employeeId.toLowerCase().includes(q)
  //   );
  // });
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) => 
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      String(u.employeeId).includes(q)
    );
  }, [users, search]);
  
  if (loading) return <PageSpinner />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="Employees"
        subtitle={`${filtered.length} employee${filtered.length !== 1 ? "s" : ""}`}
      />

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, or employee ID…"
        className="mb-6 w-full rounded-lg border border-[#e3e8ee] bg-white px-4 py-2.5 text-sm focus:border-[#20beff] focus:outline-none"
      />

      {filtered.length === 0 ? (
        <EmptyState title="No employees found" description={search ? `No results for "${search}"` : "No employees yet."} />
      ) : (
        <div className="bg-white border border-[#e3e8ee] rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e3e8ee] bg-[#f7f9fb]">
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Name</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide hidden md:table-cell">Employee ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide hidden lg:table-cell">Skills</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-[#9ca3af] uppercase tracking-wide">Role</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e3e8ee]">
              {filtered.map((u) => (
                <tr key={u._id} className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#20beff] text-white text-xs font-bold">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-[#0f1419]">{u.name}</p>
                        <p className="text-xs text-[#9ca3af]">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-[#5b6b79] hidden md:table-cell">{u.employeeId}</td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {u.skills?.slice(0, 3).map((s) => <SkillTag key={s} skill={s} />)}
                      {(u.skills?.length ?? 0) > 3 && (
                        <span className="text-xs text-[#9ca3af]">+{u.skills.length - 3}</span>
                      )}
                      {(!u.skills || u.skills.length === 0) && (
                        <span className="text-xs text-[#9ca3af]">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link
                      to={`/admin/employees/${u._id}`}
                      className="text-xs font-medium text-[#20beff] hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
