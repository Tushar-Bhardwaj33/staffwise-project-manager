import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getAllTeams, createTeam } from "../../services/team.service";
import type { ITeam } from "../../types/team.type";
import { PageSpinner } from "../../components/ui/Spinner";
import { EmptyState } from "../../components/ui/EmptyState";
import { PageHeader } from "../../components/ui/PageHeader";

const createSchema = Yup.object({
  name: Yup.string().trim().required("Team name is required"),
});

export default function Teams() {
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getAllTeams()
      .then(setTeams)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageSpinner />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title="Teams"
        subtitle={`${teams.length} team${teams.length !== 1 ? "s" : ""}`}
        action={
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-lg bg-[#20beff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f9fdb] transition-colors"
          >
            + New team
          </button>
        }
      />

      {/* Create form */}
      {showForm && (
        <div className="mb-6 bg-white border border-[#20beff] rounded-xl p-5">
          <h2 className="text-sm font-semibold text-[#0f1419] mb-3">Create a new team</h2>
          <Formik
            initialValues={{ name: "" }}
            validationSchema={createSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                const team = await createTeam({ name: values.name, members: [], createdBy: "" });
                setTeams((prev) => [team, ...prev]);
                resetForm();
                setShowForm(false);
              } catch {
                alert("Failed to create team.");
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
                    placeholder="Team name"
                    className="w-full rounded-lg border border-[#e3e8ee] px-3 py-2 text-sm focus:border-[#20beff] focus:outline-none"
                  />
                  <ErrorMessage name="name" component="div" className="mt-1 text-xs text-red-500" />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-[#20beff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0f9fdb] disabled:opacity-60"
                >
                  {isSubmitting ? "Creating…" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-[#e3e8ee] px-3 py-2 text-sm text-[#5b6b79]"
                >
                  Cancel
                </button>
              </Form>
            )}
          </Formik>
        </div>
      )}

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by team name…"
        className="mb-6 w-full rounded-lg border border-[#e3e8ee] bg-white px-4 py-2.5 text-sm focus:border-[#20beff] focus:outline-none"
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No teams found"
          description={search ? `No results for "${search}"` : "Create your first team to get started."}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((team) => (
            <Link
              key={team._id}
              to={`/admin/teams/${team._id}`}
              className="group bg-white border border-[#e3e8ee] rounded-xl p-5 hover:shadow-md hover:border-[#20beff] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5fe] text-[#0284c7] font-bold text-base">
                  ◉
                </div>
                <div>
                  <p className="font-semibold text-[#0f1419] group-hover:text-[#0284c7] transition-colors">
                    {team.name}
                  </p>
                  <p className="text-xs text-[#9ca3af]">
                    {team.members?.length ?? 0} member{(team.members?.length ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}