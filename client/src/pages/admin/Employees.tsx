import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../services/users.services";
import type { IUser } from "../../types/user.type";
import { PageSpinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";
import { SkillTag } from "../../components/ui/SkillTag";
import { RoleBadge } from "../../components/ui/Badge";
import { ContactCard } from "../../components/ui/ContactCard";
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
      u.employeeId.toLowerCase().includes(q)
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((u) => (
            <ContactCard key={u._id} user={u} />
          ))}
        </div>
      )}
    </div>
  );
}
