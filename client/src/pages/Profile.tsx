import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/useAuth";
import { updateProfile } from "../services/users.services";
import { PageHeader } from "../components/ui/PageHeader";
import { SkillTag } from "../components/ui/SkillTag";
import { RoleBadge } from "../components/ui/Badge";
import { UserCard } from "../components/ui/UserCard";

interface ProfileFormValues {
  name: string;
  skillInput: string;
}

const profileSchema = Yup.object({
  name: Yup.string().trim().min(2, "Name is too short").required("Name is required"),
  skillInput: Yup.string(),
});

const fieldClass =
  "block w-full rounded-md border border-[#e3e8ee] bg-white px-3 py-2 text-sm text-[#0f1419] placeholder-[#9ca3af] focus:border-[#20beff] focus:outline-none focus:ring-1 focus:ring-[#20beff]";

export default function Profile() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<string[]>(user?.skills ?? []);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const addSkill = (input: string, setFieldValue: (f: string, v: string) => void) => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
    }
    setFieldValue("skillInput", "");
  };

  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill));

  const handleSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    setServerError("");
    setSaveSuccess(false);
    try {
      await updateProfile(user._id, { name: values.name, skills });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setServerError("Failed to save. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <PageHeader title="My Profile" subtitle="Manage your personal info and skills" />

      <div className="bg-white border border-[#e3e8ee] rounded-xl p-6 mb-6">
        {/* Avatar + meta */}
        <div className="mb-6 flex justify-center">
          <UserCard user={user} />
        </div>

        {/* Read-only info */}
        <div className="grid grid-cols-2 gap-4 rounded-lg bg-[#f7f9fb] p-4 mb-6 text-sm">
          <div>
            <p className="text-xs text-[#9ca3af] font-medium uppercase tracking-wide">Employee ID</p>
            <p className="mt-0.5 font-mono text-[#0f1419]">{user.employeeId}</p>
          </div>
          <div>
            <p className="text-xs text-[#9ca3af] font-medium uppercase tracking-wide">Role</p>
            <p className="mt-0.5 capitalize text-[#0f1419]">{user.role}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-[#9ca3af] font-medium uppercase tracking-wide">Email</p>
            <p className="mt-0.5 text-[#0f1419]">{user.email}</p>
          </div>
        </div>

        {/* Editable form */}
        <Formik
          initialValues={{ name: user.name, skillInput: "" }}
          validationSchema={profileSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#0f1419] mb-1">Full name</label>
                <Field id="name" name="name" type="text" className={fieldClass} />
                <ErrorMessage name="name" component="div" className="mt-1 text-xs text-red-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f1419] mb-1">Skills</label>
                <div className="flex flex-wrap gap-1.5 min-h-8 mb-2">
                  {skills.map((s) => (
                    <SkillTag key={s} skill={s} onRemove={() => removeSkill(s)} />
                  ))}
                  {skills.length === 0 && <span className="text-xs text-[#9ca3af]">No skills added yet</span>}
                </div>
                <div className="flex gap-2">
                  <Field
                    id="skillInput"
                    name="skillInput"
                    type="text"
                    placeholder="Add a skill and press Enter"
                    className={fieldClass}
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
                    className="rounded-md border border-[#e3e8ee] px-3 py-2 text-sm text-[#5b6b79] hover:border-[#20beff] hover:text-[#20beff] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {serverError && <p className="text-sm text-red-500">{serverError}</p>}
              {saveSuccess && <p className="text-sm text-emerald-600">Profile saved successfully!</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-[#20beff] px-5 py-2 text-sm font-semibold text-white hover:bg-[#0f9fdb] disabled:opacity-60 transition-colors"
              >
                {isSubmitting ? "Saving…" : "Save changes"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}