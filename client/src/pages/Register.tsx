import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import { AuthCard } from "../components/AuthCard";

interface RegisterFormValues {
  name: string;
  email: string;
  employeeId: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = Yup.object({
  name: Yup.string().trim().min(2, "Name is too short").required("Name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  employeeId: Yup.string().trim().required("Employee ID is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

const fieldClass =
  "mt-1 block w-full rounded-md border border-[#e3e8ee] bg-white px-3 py-2 text-sm text-[#0f1419] placeholder-[#9ca3af] focus:border-[#20beff] focus:outline-none focus:ring-1 focus:ring-[#20beff]";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    setServerError("");
    try {
      await register({
        name: values.name,
        email: values.email,
        employeeId: values.employeeId,
        password: values.password,
      });
      navigate("/dashboard");
    } catch (err) {
      if (isAxiosError(err)) {
        setServerError(err.response?.data?.message ?? "Registration failed. Please try again.");
      } else {
        setServerError("An unexpected error occurred.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[#20beff] hover:underline">
            Log in
          </Link>
        </>
      }
    >
      {serverError && (
        <p role="alert" className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {serverError}
        </p>
      )}
      <Formik
        initialValues={{ name: "", email: "", employeeId: "", password: "", confirmPassword: "" }}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-1" noValidate>
            <label htmlFor="name" className="mt-3 text-sm font-medium text-[#0f1419]">Full name</label>
            <Field id="name" name="name" type="text" autoComplete="name" className={fieldClass} placeholder="Jane Smith" />
            <ErrorMessage name="name" component="div" className="text-xs text-red-500" />

            <label htmlFor="email" className="mt-3 text-sm font-medium text-[#0f1419]">Email</label>
            <Field id="email" name="email" type="email" autoComplete="email" className={fieldClass} placeholder="jane@company.com" />
            <ErrorMessage name="email" component="div" className="text-xs text-red-500" />

            <label htmlFor="employeeId" className="mt-3 text-sm font-medium text-[#0f1419]">
              Employee ID
            </label>
            <Field id="employeeId" name="employeeId" type="text" className={fieldClass} placeholder="e.g. 1433" />
            <ErrorMessage name="employeeId" component="div" className="text-xs text-red-500" />
            <p className="text-xs text-[#9ca3af]">Ask your admin if you don't have one yet.</p>

            <label htmlFor="password" className="mt-3 text-sm font-medium text-[#0f1419]">Password</label>
            <Field id="password" name="password" type="password" autoComplete="new-password" className={fieldClass} placeholder="At least 6 characters" />
            <ErrorMessage name="password" component="div" className="text-xs text-red-500" />

            <label htmlFor="confirmPassword" className="mt-3 text-sm font-medium text-[#0f1419]">Confirm password</label>
            <Field id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" className={fieldClass} />
            <ErrorMessage name="confirmPassword" component="div" className="text-xs text-red-500" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 rounded-md bg-[#20beff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0f9fdb] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </button>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}
