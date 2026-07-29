import { useEffect, useState } from "react";
import { useAuth } from "../../../context/useAuth";
import {
  submitReflection,
  getReflectionByEmployeeAndProject,
  getReflectionsByProject,
  submitValidation,
  getMyValidation,
  getValidationsByEmployeeAndProject,
} from "../../../services/history.service";
import type { IEmployeeReflection, IAdminValidation } from "../../../types/history.type";
import { Spinner } from "../../../components/ui/Spinner";
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { SkillTag } from "../../../components/ui/SkillTag";
import { getAllUsers } from "../../../services/users.services";
import type { IUser } from "../../../types/user.type";

interface Props { projectId: string }

const reflectionSchema = Yup.object({
  whatBuilt: Yup.string().trim().min(10, "Must be at least 10 characters").required("This field is required"),
  whatWentWell: Yup.string().trim().min(10, "Must be at least 10 characters").required("This field is required"),
  whatWentWrong: Yup.string().trim().min(10, "Must be at least 10 characters").required("This field is required"),
});

const validationSchema = Yup.object({
  technical: Yup.number().min(1).max(10).required("Required"),
  collaboration: Yup.number().min(1).max(10).required("Required"),
  ownership: Yup.number().min(1).max(10).required("Required"),
  qualitativeNote: Yup.string().trim().min(10, "Must be at least 10 characters").required("Note is required"),
});

const fieldClass = "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none resize-none";

export default function ReflectionsTab({ projectId }: Props) {
  const { user } = useAuth();
  
  if (!user) return null;
  
  if (user.role === "employee") {
    return <EmployeeReflectionView projectId={projectId} userId={user._id} />;
  }
  
  if (user.role === "admin") {
    return <AdminValidationView projectId={projectId} adminId={user._id} />;
  }

  return null;
}

// ==========================================
// EMPLOYEE VIEW
// ==========================================

function EmployeeReflectionView({ projectId, userId }: { projectId: string; userId: string }) {
  const [reflection, setReflection] = useState<IEmployeeReflection | null>(null);
  const [validations, setValidations] = useState<IAdminValidation[]>([]);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      getReflectionByEmployeeAndProject(userId, projectId).catch(() => null),
      getValidationsByEmployeeAndProject(userId, projectId).catch(() => []),
    ]).then(([r, v]) => {
      setReflection(r);
      setValidations(v);
    }).finally(() => setLoading(false));
  }, [projectId, userId]);

  const addSkill = (input: string, setFieldValue: (f: string, v: string) => void) => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills((prev) => [...prev, trimmed]);
    setFieldValue("skillInput", "");
  };

  if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      {!reflection ? (
        <div className="bg-white border border-blue-600 rounded-xl p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Project Reflection</h2>
          <p className="text-sm text-gray-500 mb-6">
            Submit your reflection to finalize your participation in this project. This will be reviewed by an admin and added to your permanent work history.
          </p>

          <Formik
            initialValues={{ whatBuilt: "", whatWentWell: "", whatWentWrong: "", skillInput: "" }}
            validationSchema={reflectionSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const r = await submitReflection({
                  employeeId: userId,
                  projectId,
                  whatBuilt: values.whatBuilt,
                  whatWentWell: values.whatWentWell,
                  whatWentWrong: values.whatWentWrong,
                  skillsGainedOrUsed: skills,
                });
                setReflection(r);
                toast.success("Reflection submitted successfully");
              } catch {
                toast.error("Failed to submit reflection");
              } finally {
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, values, setFieldValue }) => (
              <Form className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">What did you build/contribute?</label>
                  <Field as="textarea" name="whatBuilt" rows={3} className={fieldClass} />
                  <ErrorMessage name="whatBuilt" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">What went well?</label>
                  <Field as="textarea" name="whatWentWell" rows={2} className={fieldClass} />
                  <ErrorMessage name="whatWentWell" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">What could be improved?</label>
                  <Field as="textarea" name="whatWentWrong" rows={2} className={fieldClass} />
                  <ErrorMessage name="whatWentWrong" component="div" className="mt-1 text-xs text-red-500" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-1">Skills Used or Gained</label>
                  <div className="flex flex-wrap gap-1.5 min-h-8 mb-2">
                    {skills.map((s) => (
                      <SkillTag key={s} skill={s} onRemove={() => setSkills(skills.filter((sk) => sk !== s))} />
                    ))}
                    {skills.length === 0 && <span className="text-xs text-gray-400">Add skills you utilized</span>}
                  </div>
                  <div className="flex gap-2">
                    <Field
                      name="skillInput"
                      type="text"
                      placeholder="Type a skill and press Enter"
                      className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkill(values.skillInput, setFieldValue);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => addSkill(values.skillInput, setFieldValue)}
                      className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Reflection"}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Reflection</h2>
              <p className="text-sm text-blue-600">Submitted on {new Date(reflection.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
              ✓
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">What you built</h3>
              <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">{reflection.whatBuilt}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">What went well</h3>
              <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">{reflection.whatWentWell}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">What went wrong</h3>
              <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">{reflection.whatWentWrong}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">Skills</h3>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {reflection.skillsGainedOrUsed.map(s => <SkillTag key={s} skill={s} />)}
              </div>
            </div>
          </div>
        </div>
      )}

      {validations.length > 0 && (
        <div className="space-y-4 mt-8">
          <h2 className="text-lg font-bold text-gray-900">Admin Validations</h2>
          {validations.map((v) => (
            <div key={v._id} className="bg-white border border-green-200 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Validated</span>
                <span className="text-xs text-gray-500">{new Date(v.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-900">{v.performanceScores.technical}/10</div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Technical</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-900">{v.performanceScores.collaboration}/10</div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Collaboration</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-gray-900">{v.performanceScores.ownership}/10</div>
                  <div className="text-xs text-gray-500 uppercase font-semibold">Ownership</div>
                </div>
              </div>
              <div className="mb-4">
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">Feedback</h3>
                <p className="text-sm text-gray-800 italic break-words whitespace-pre-wrap">"{v.qualitativeNote}"</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-2">Validated Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {v.skillValidation.map(s => <SkillTag key={s} skill={s} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// ADMIN VIEW
// ==========================================

function AdminValidationView({ projectId, adminId }: { projectId: string; adminId: string }) {
  const [reflections, setReflections] = useState<IEmployeeReflection[]>([]);
  const [users, setUsers] = useState<Record<string, IUser>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    Promise.all([
      getReflectionsByProject(projectId).catch(() => []),
      getAllUsers().catch(() => [])
    ]).then(([refs, allUsers]) => {
      setReflections(refs);
      const userMap = allUsers.reduce((acc, u) => ({ ...acc, [u._id]: u }), {} as Record<string, IUser>);
      setUsers(userMap);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [projectId]);

  if (loading) return <div className="flex justify-center py-10"><Spinner /></div>;

  if (reflections.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
        No employee reflections have been submitted for this project yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reflections.map((r) => (
        <AdminValidationRow 
          key={r._id} 
          reflection={r} 
          user={users[r.employeeId]} 
          adminId={adminId}
          projectId={projectId}
        />
      ))}
    </div>
  );
}

function AdminValidationRow({ 
  reflection, 
  user, 
  adminId, 
  projectId 
}: { 
  reflection: IEmployeeReflection; 
  user: IUser | undefined; 
  adminId: string;
  projectId: string;
}) {
  const [validation, setValidation] = useState<IAdminValidation | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getMyValidation(reflection.employeeId, projectId)
      .then(setValidation)
      .catch(() => setValidation(null))
      .finally(() => setLoading(false));
  }, [reflection.employeeId, projectId]);

  if (loading) return <div className="animate-pulse bg-gray-100 h-32 rounded-xl mb-4" />;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
            {user?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{user?.name || "Unknown Employee"}</h3>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>
        {validation ? (
          <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Validated</span>
        ) : (
          <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded">Needs Validation</span>
        )}
      </div>

      <div className="p-6 grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-gray-900 border-b pb-2">Employee's Reflection</h4>
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">What they built</h3>
            <p className="text-sm text-gray-900 whitespace-pre-wrap break-words">{reflection.whatBuilt}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">Went Well</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{reflection.whatWentWell}</p>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">Went Wrong</h3>
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{reflection.whatWentWrong}</p>
            </div>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">Claimed Skills</h3>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {reflection.skillsGainedOrUsed.map(s => <SkillTag key={s} skill={s} />)}
            </div>
          </div>
        </div>

        <div>
          {validation ? (
            <div className="space-y-4">
               <h4 className="text-sm font-bold text-green-700 border-b pb-2">Your Validation</h4>
               <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="text-lg font-bold text-gray-900">{validation.performanceScores.technical}/10</div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Technical</div>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="text-lg font-bold text-gray-900">{validation.performanceScores.collaboration}/10</div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Collab</div>
                </div>
                <div className="bg-gray-50 p-2 rounded text-center">
                  <div className="text-lg font-bold text-gray-900">{validation.performanceScores.ownership}/10</div>
                  <div className="text-[10px] text-gray-500 uppercase font-semibold">Ownership</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 italic break-words whitespace-pre-wrap">"{validation.qualitativeNote}"</p>
              <div>
                <h3 className="text-xs font-semibold uppercase text-gray-500 mb-1">Validated Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {validation.skillValidation.map(s => <SkillTag key={s} skill={s} />)}
                </div>
              </div>
            </div>
          ) : (
            <Formik
              initialValues={{
                technical: 3,
                collaboration: 3,
                ownership: 3,
                qualitativeNote: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  const v = await submitValidation({
                    adminId,
                    projectId,
                    employeeId: reflection.employeeId,
                    performanceScores: {
                      technical: values.technical,
                      collaboration: values.collaboration,
                      ownership: values.ownership,
                    },
                    skillValidation: reflection.skillsGainedOrUsed, // For simplicity, validate all claimed skills
                    qualitativeNote: values.qualitativeNote,
                  });
                  setValidation(v);
                  toast.success("Validation submitted");
                } catch {
                  toast.error("Failed to submit validation");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <h4 className="text-sm font-bold text-blue-700 border-b pb-2">Submit Validation</h4>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Technical / 10</label>
                      <Field type="number" name="technical" min={1} max={10} className={fieldClass + " text-center"} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Collab / 10</label>
                      <Field type="number" name="collaboration" min={1} max={10} className={fieldClass + " text-center"} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Ownership / 10</label>
                      <Field type="number" name="ownership" min={1} max={10} className={fieldClass + " text-center"} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">Qualitative Feedback</label>
                    <Field as="textarea" name="qualitativeNote" rows={2} className={fieldClass} placeholder="Leave feedback for the employee..." />
                    <ErrorMessage name="qualitativeNote" component="div" className="mt-1 text-xs text-red-500" />
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-blue-900">Skills to validate:</p>
                      <p className="text-[10px] text-blue-700">Submitting will validate all claimed skills.</p>
                    </div>
                    <div className="text-right font-bold text-blue-900">
                      {reflection.skillsGainedOrUsed.length}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Validation"}
                  </button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}
