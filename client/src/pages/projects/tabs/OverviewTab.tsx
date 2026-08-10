import { useEffect, useState } from "react";
import { useAuth } from "../../../context/useAuth";
import type { IProject } from "../../../types/project.type";
import { SkillTag } from "../../../components/ui/SkillTag";
import { ProgressBar } from "../../../components/ui/ProgressBar";
import { submitPreference } from "../../../services/prefrences.service";
import type { IPreference } from "../../../services/prefrences.service";

interface Props {
  project: IProject;
  onProjectUpdate: (p: IProject) => void;
}

export default function OverviewTab({ project }: Props) {
  const { user } = useAuth();
  const [preference, setPreference] = useState<IPreference | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reason, setReason] = useState("");
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [pendingInterest, setPendingInterest] = useState<"interested" | "not-interested" | null>(null);

  useEffect(() => {
    if (user?.role !== "employee") return;
    // Try to find the current user's preference from the list
    // (some backends don't have a /mine endpoint, so we fall back gracefully)
    import("../../../services/prefrences.service").then(({ getProjectPreferences }) => {
      getProjectPreferences(project._id)
        .then((prefs) => {
          const mine = prefs.find((p) => {
            const empId = typeof p.employee === "string" ? p.employee : (p.employee as { _id: string })._id;
            return empId === user._id;
          });
          if (mine) setPreference(mine);
        })
        .catch(() => {});
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project._id, user]);

  const handleInterestClick = (interest: "interested" | "not-interested") => {
    setPendingInterest(interest);
    setShowReasonInput(true);
  };

  const confirmPreference = async () => {
    if (!pendingInterest) return;
    setSubmitting(true);
    try {
      const pref = await submitPreference(project._id, { interest: pendingInterest, reason: reason || undefined });
      setPreference(pref);
      setShowReasonInput(false);
      setReason("");
    } catch {
      alert("Failed to submit preference. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Timeline</h2>
        <ProgressBar startDate={project.startDate} endDate={project.endDate} />
      </div>

      {/* Description */}
      {project.description && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Overview</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.description}</p>
        </div>
      )}

      {/* Required skills */}
      {project.requiredSkills?.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Required skills</h2>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills.map((s) => (
              <SkillTag key={s} skill={s} />
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Project info</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide">Type</dt>
            <dd className="mt-0.5 capitalize text-gray-900">{project.type}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide">Teams assigned</dt>
            <dd className="mt-0.5 text-gray-900">{project.assignedTeams?.length ?? 0}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide">Start date</dt>
            <dd className="mt-0.5 text-gray-900">
              {new Date(project.startDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-400 font-medium uppercase tracking-wide">End date</dt>
            <dd className="mt-0.5 text-gray-900">
              {new Date(project.endDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
            </dd>
          </div>
        </dl>
      </div>

      {/* Interest (employee only) */}
      {user?.role === "employee" && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Your interest</h2>

          {preference ? (
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                  preference.interest === "interested"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {preference.interest === "interested" ? "✓ Interested" : "✗ Not interested"}
              </span>
              {preference.reason && (
                <span className="text-sm text-gray-400 break-words whitespace-pre-wrap line-clamp-3">— {preference.reason}</span>
              )}
              <button
                onClick={() => { setPreference(null); setShowReasonInput(false); }}
                className="ml-auto text-xs text-blue-600 hover:underline"
              >
                Change
              </button>
            </div>
          ) : showReasonInput ? (
            <div className="space-y-3 mt-2">
              <p className="text-sm text-gray-500">
                Marking as <strong>{pendingInterest === "interested" ? "Interested" : "Not interested"}</strong>
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Add a reason (optional)"
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={confirmPreference}
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? "Submitting…" : "Confirm"}
                </button>
                <button
                  onClick={() => setShowReasonInput(false)}
                  className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:border-blue-600 hover:text-blue-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => handleInterestClick("interested")}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
              >
                ✓ Interested
              </button>
              <button
                onClick={() => handleInterestClick("not-interested")}
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors"
              >
                ✗ Not interested
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}