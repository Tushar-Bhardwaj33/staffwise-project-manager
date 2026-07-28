import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { updateProject } from "../../services/project.service";
import { SkillTag } from "../../components/ui/SkillTag";
import type { IProject } from "../../types/project.type";
import { toast } from "react-toastify";

interface ProjectEditModalProps {
  isOpen: boolean;
  project: IProject;
  onClose: () => void;
  onSuccess: (updated: IProject) => void;
}

interface EditProjectValues {
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

export function ProjectEditModal({ isOpen, project, onClose, onSuccess }: ProjectEditModalProps) {
  const [skills, setSkills] = useState<string[]>(project.requiredSkills || []);

  const addSkill = (input: string, setFieldValue: (f: string, v: string) => void) => {
    const trimmed = input.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills((prev) => [...prev, trimmed]);
    setFieldValue("skillInput", "");
  };

  const handleSubmit = async (
    values: EditProjectValues,
    { setSubmitting }: FormikHelpers<EditProjectValues>
  ) => {
    try {
      const updated = await updateProject(project._id, {
        title: values.title,
        description: values.description,
        type: values.type,
        requiredSkills: skills,
        startDate: values.startDate,
        endDate: values.endDate,
      });
      toast.success("Project updated successfully");
      onSuccess(updated);
    } catch {
      toast.error("Failed to update project. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold leading-6 text-gray-900 mb-4">
          Edit Project
        </h3>
        
        <Formik<EditProjectValues>
          initialValues={{
            title: project.title,
            description: project.description,
            type: project.type,
            startDate: project.startDate.split('T')[0],
            endDate: project.endDate.split('T')[0],
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
                <Field id="title" name="title" type="text" className={fieldClass} />
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
                  rows={3}
                  className={fieldClass + " resize-none"}
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

              <div className="mt-6 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {isSubmitting ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
