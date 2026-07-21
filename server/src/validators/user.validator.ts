import * as yup from "yup";

export const updateProfileSchema = yup.object({
  name: yup.string().trim(),
  skills: yup.array().of(yup.string().trim()),
});

export const updateRoleSchema = yup.object({
  role: yup
    .mixed<"admin" | "employee">()
    .oneOf(["admin", "employee"], "Role must be admin or employee")
    .required("Role is required"),
});