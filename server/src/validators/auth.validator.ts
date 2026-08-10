import * as yup from "yup";

export const registerSchema = yup.object({
  name: yup.string().trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain alphabets and spaces")
    .required("Name is required"),
  email: yup.string().trim().lowercase().email("Invalid email").required("Email is required"),
  employeeId: yup.number()
    .typeError("Employee ID must be a number")
    .integer("Employee ID must be an integer")
    .min(1, "Employee ID must be at least 1")
    .max(2147483647, "Employee ID cannot exceed 2147483647")
    .required("Employee ID is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  skills: yup.array().of(yup.string().trim()).default([]),
});

export const loginSchema = yup.object({
  email: yup.string().trim().lowercase().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});