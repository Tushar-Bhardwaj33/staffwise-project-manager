import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTeamById, addMemberToTeam, removeMemberFromTeam } from "../../services/team.service";
import { getAllUsers } from "../../services/users.services";
import type { ITeam } from "../../types/team.type";
import type { IUser } from "../../types/user.type";
import { PageSpinner } from "../../components/ui/Spinner";
import { PageHeader } from "../../components/ui/PageHeader";

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<ITeam | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingUser, setAddingUser] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTeam = async (teamId: string) => {
    try {
      const t = await getTeamById(teamId);
      setTeam(t);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!id) return;
    Promise.all([
      fetchTeam(id),
      getAllUsers()
    ]).then(([, u]) => {
      // Only employees can be added to teams
      setUsers(u.filter((user) => user.role === "employee"));
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleAddMember = async () => {
    if (!addingUser || !team || submitting) return;
    setSubmitting(true);
    try {
      await addMemberToTeam(team._id, addingUser);
      await fetchTeam(team._id); // Re-fetch to get populated members
      setAddingUser("");
    } catch (e) {
      alert("Failed to add member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!team) return;
    if (!window.confirm("Remove this member from the team?")) return;
    try {
      await removeMemberFromTeam(team._id, userId);
      await fetchTeam(team._id); // Re-fetch to get populated members
    } catch (e) {
      alert("Failed to remove member");
    }
  };

  if (loading) return <PageSpinner />;
  if (!team) return <div className="p-8 text-center text-gray-500">Team not found</div>;

  // Filter out users already in the team
  const availableUsers = users.filter(
    (u) => !team.members?.some((m: any) => m._id === u._id || m === u._id)
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link to="/admin/teams" className="text-sm text-blue-600 hover:underline">← Back to teams</Link>
      </div>
      <PageHeader
        title={team.name}
        subtitle={`${team.members?.length || 0} members`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Members List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Team Members</h2>
          {(!team.members || team.members.length === 0) ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
              No members in this team yet.
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
              {team.members.map((member: any) => (
                <div key={member._id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
                      {member.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveMember(member._id)}
                    className="text-xs text-red-600 hover:underline px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Member Form */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">Add Member</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <select
              value={addingUser}
              onChange={(e) => setAddingUser(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none mb-3"
            >
              <option value="">Select an employee...</option>
              {availableUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            <button
              onClick={handleAddMember}
              disabled={!addingUser || submitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Adding..." : "Add to Team"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}