import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTeamById, addMemberToTeam, removeMemberFromTeam } from "../../services/team.service";
import { getAllUsers } from "../../services/users.services";
import type { ITeam } from "../../types/team.type";
import type { IUser } from "../../types/user.type";
import { PageSpinner } from "../../components/ui/Spinner";
import { PageHeader } from "../../components/ui/PageHeader";
import { ConfirmModal } from "../../components/ui/ConfirmModal";
import { toast } from "../../utils/toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { updateTeam, deleteTeam } from "../../services/team.service";
import { useNavigate } from "react-router-dom";

const updateSchema = Yup.object({
  name: Yup.string().trim().required("Team name is required"),
});

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>();
  const [team, setTeam] = useState<ITeam | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingUser, setAddingUser] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const navigate = useNavigate();

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
      toast.success("Member Added", "Team member has been added");
    } catch (e) {
      toast.error("Error", "Failed to add member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!team) return;
    try {
      await removeMemberFromTeam(team._id, userId);
      await fetchTeam(team._id); // Re-fetch to get populated members
      toast.success("Member Removed", "Team member has been removed");
    } catch (e) {
      toast.error("Error", "Failed to remove member");
    }
  };

  const handleDeleteTeam = async () => {
    if (!team) return;
    try {
      await deleteTeam(team._id);
      toast.success("Team Deleted", "Team has been deleted successfully");
      navigate("/admin/teams");
    } catch {
      toast.error("Error", "Failed to delete team");
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
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setShowEdit((v) => !v)}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Edit Team
            </button>
            <button
              onClick={() => setShowDelete(true)}
              className="rounded-lg bg-red-50 text-red-600 px-4 py-2 text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        }
      />

      {showEdit && (
        <div className="mt-4 bg-white border border-blue-200 rounded-xl p-5 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Edit team name</h2>
          <Formik
            initialValues={{ name: team.name }}
            validationSchema={updateSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const updated = await updateTeam(team._id, { name: values.name });
                setTeam(updated);
                setShowEdit(false);
                toast.success("Team Updated", "Team has been updated");
              } catch {
                toast.error("Error", "Failed to update team.");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form className="flex gap-2">
                <div className="flex-1">
                  <Field
                    name="name"
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                  <ErrorMessage name="name" component="div" className="mt-1 text-xs text-red-500" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {isSubmitting ? "Saving…" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-500"
                >
                  Cancel
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}

      <div className={`grid grid-cols-1 gap-6 mt-6 ${showEdit ? 'md:grid-cols-3' : ''}`}>
        {/* Members List */}
        <div className={`space-y-4 ${showEdit ? 'md:col-span-2' : ''}`}>
          <h2 className="text-sm font-semibold text-gray-900">Team Members</h2>
          {(!team.members || team.members.length === 0) ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
              No members in this team yet.
            </div>
          ) : (
            <div className={showEdit ? "bg-white border border-gray-200 rounded-xl divide-y divide-gray-100" : "grid sm:grid-cols-2 md:grid-cols-3 gap-4"}>
              {team.members.map((member: any) => {
                const fullUser = users.find((u) => u._id === member._id);
                const memberSkills = fullUser?.skills || [];
                
                return (
                  <div 
                    key={member._id} 
                    className={`group relative flex items-center justify-between bg-white ${showEdit ? 'p-4' : 'p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-sm transition-all'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold shrink-0">
                        {member.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{fullUser?.employeeId || member.employeeId}</p>
                      </div>
                    </div>
                    {showEdit && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-xs text-red-600 hover:underline px-2 py-1 shrink-0"
                      >
                        Remove
                      </button>
                    )}

                    {/* Hover Tooltip for Skills */}
                    {!showEdit && memberSkills.length > 0 && (
                      <div className="absolute top-full left-0 mt-2 w-full z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg">
                          <p className="font-semibold mb-1">Skills:</p>
                          <div className="flex flex-wrap gap-1">
                            {memberSkills.map((s: string) => (
                              <span key={s} className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-200 border border-gray-700">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add Member Form */}
        {showEdit && (
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
                    {u.name} ({u.employeeId})
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
        )}
      </div>

      <ConfirmModal
        isOpen={showDelete}
        title="Delete Team"
        message="Are you sure you want to delete this team? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDeleteTeam}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}