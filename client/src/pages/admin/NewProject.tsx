import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { createProject } from "../../services/project.service";
import { PageHeader } from "../../components/ui/PageHeader";
import { SkillTag } from "../../components/ui/SkillTag";
import { useAuth } from "../../context/useAuth";

interface NewProjectValues {
  title: string;
  description: string;
  type: "personal" | "company" | "product" | "client";
  startDate: string;
  endDate: string;
  skillInput: string;
}

const schema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
  type: Yup.mixed<"personal" | "company" | "product" | "client">()
    .oneOf(["personal", "company", "product", "client"])
    .required("Type is required"),
  startDate: Yup.date().required("Start date is required"),
  endDate: Yup.date()
    .required("End date is required")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  skillInput: Yup.string(),
});

const fieldClass =
  "block w-full rounded-lg border border-[#e3e8ee] bg-white px-3 py-2 text-sm text-[#0f1419] placeholder-[#9ca3af] focus:border-[#20beff] focus:outline-none focus:ring-1 focus:ring-[#20beff]";

export default function NewProject() {
  const { user } = useAuth();
  const id = user?._id;
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>([]);
  const [serverError, setServerError] = useState("");

  const addSkill = (input: string, setFieldValue: (f: string, v: string) => void) => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills((prev) => [...prev, trimmed]);
    setFieldValue("skillInput", "");
  };

  const handleSubmit = async (
    values: NewProjectValues,
    { setSubmitting }: FormikHelpers<NewProjectValues>
  ) => {
    setServerError("");
    try {
      const project = await createProject({
        title: values.title,
        description: values.description,
        type: values.type,
        requiredSkills: skills,
        startDate: values.startDate,
        endDate: values.endDate,
        assignedTeams: [],
        createdBy: id as string,
      });
      navigate(`/projects/${project._id}`);
    } catch {
      setServerError("Failed to create project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <PageHeader title="New Project" subtitle="Create a new project for your organisation" />

      <div className="bg-white border border-[#e3e8ee] rounded-xl p-6">
        <Formik<NewProjectValues>
          initialValues={{
            title: "",
            description: "",
            type: "company",
            startDate: "",
            endDate: "",
            skillInput: "",
          }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-5">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-[#0f1419] mb-1">
                  Project title <span className="text-red-400">*</span>
                </label>
                <Field id="title" name="title" type="text" className={fieldClass} placeholder="e.g. Customer Portal Redesign" />
                <ErrorMessage name="title" component="div" className="mt-1 text-xs text-red-500" />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-[#0f1419] mb-1">
                  Description <span className="text-red-400">*</span>
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  className={fieldClass + " resize-none"}
                  placeholder="Describe the project goals, scope, and context…"
                />
                <ErrorMessage name="description" component="div" className="mt-1 text-xs text-red-500" />
              </div>

              {/* Type */}
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-[#0f1419] mb-1">
                  Project type <span className="text-red-400">*</span>
                </label>
                <Field as="select" id="type" name="type" className={fieldClass}>
                  <option value="personal">Personal</option>
                  <option value="company">Company</option>
                  <option value="product">Product</option>
                  <option value="client">Client</option>
                </Field>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-[#0f1419] mb-1">
                    Start date <span className="text-red-400">*</span>
                  </label>
                  <Field id="startDate" name="startDate" type="date" className={fieldClass} />
                  <ErrorMessage name="startDate" component="div" className="mt-1 text-xs text-red-500" />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-[#0f1419] mb-1">
                    End date <span className="text-red-400">*</span>
                  </label>
                  <Field id="endDate" name="endDate" type="date" className={fieldClass} />
                  <ErrorMessage name="endDate" component="div" className="mt-1 text-xs text-red-500" />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-[#0f1419] mb-1">Required skills</label>
                <div className="flex flex-wrap gap-1.5 min-h-8 mb-2">
                  {skills.map((s) => (
                    <SkillTag key={s} skill={s} onRemove={() => setSkills(skills.filter((sk) => sk !== s))} />
                  ))}
                  {skills.length === 0 && <span className="text-xs text-[#9ca3af]">Add skills employees should have</span>}
                </div>
                <div className="flex gap-2">
                  <Field
                    name="skillInput"
                    type="text"
                    placeholder="Type a skill and press Enter"
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
                    className="rounded-lg border border-[#e3e8ee] px-3 py-2 text-sm text-[#5b6b79] hover:border-[#20beff] hover:text-[#20beff]"
                  >
                    Add
                  </button>
                </div>
              </div>

              {serverError && (
                <p className="text-sm text-red-500">{serverError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-[#20beff] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0f9fdb] disabled:opacity-60 transition-colors"
                >
                  {isSubmitting ? "Creating…" : "Create project"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/projects")}
                  className="rounded-lg border border-[#e3e8ee] px-4 py-2.5 text-sm font-medium text-[#5b6b79] hover:border-[#20beff]"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
