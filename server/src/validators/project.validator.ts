import * as yup from "yup";

export const createProjectSchema = yup.object({
  title: yup.string().trim().required("Title is required"),
  description: yup.string().trim().required("Description is required"),
  type: yup
    .mixed<"personal" | "company" | "product" | "client">()
    .oneOf(["personal", "company", "product", "client"], "Invalid project type")
    .required("Type is required"),
  requiredSkills: yup.array().of(
    yup.string().trim()
      .max(30, "Tag cannot exceed 30 characters")
      .matches(/^[a-zA-Z0-9\s.\-+#]+$/, "Tag contains invalid characters")
  ).default([]),
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .required("End date is required")
    .min(yup.ref("startDate"), "End date must be after start date"),
});

export const updateProjectSchema = createProjectSchema.partial();
