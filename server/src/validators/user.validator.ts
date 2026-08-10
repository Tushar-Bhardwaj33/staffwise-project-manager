import * as yup from "yup";

export const updateProfileSchema = yup.object({
  name: yup.string().trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain alphabets and spaces"),
  skills: yup.array().of(yup.string().trim()),
});

export const updateRoleSchema = yup.object({
  role: yup
    .mixed<"admin" | "employee">()
    .oneOf(["admin", "employee"], "Role must be admin or employee")
    .required("Role is required"),
});