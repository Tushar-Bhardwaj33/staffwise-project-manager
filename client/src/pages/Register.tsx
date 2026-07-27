// src/pages/Register.tsx
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import type { IRegisterPayload } from "../services/auth.service";
import { AuthCard } from "../components/AuthCard";

const registerSchema = Yup.object({
  name: Yup.string().trim().required("Name is required"),
  email: Yup.string().trim().email("Invalid email").required("Email is required"),
  employeeId: Yup.string().trim().required("Employee ID is required"),
  password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const fieldClass =
  "rounded-md border border-border px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-brand";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const initialValues: IRegisterPayload = { name: "", email: "", employeeId: "", password: "" };

  const handleSubmit = async (
    values: IRegisterPayload,
    { setSubmitting }: FormikHelpers<IRegisterPayload>
  ) => {
    setServerError(null);
    try {
      await register(values);
      navigate("/", { replace: true });
    } catch (err) {
      const message = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message ?? "Could not create account"
        : "Something went wrong. Please try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create account"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand hover:underline">
            Log in
          </Link>
        </>
      }
    >
      {serverError && (
        <p role="alert" className="mb-4 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      )}

      <Formik<IRegisterPayload>
        initialValues={initialValues}
        validationSchema={registerSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-1" noValidate>
            <label htmlFor="name" className="mt-3 text-sm font-medium text-ink">Name</label>
            <Field id="name" name="name" type="text" autoComplete="name" className={fieldClass} />
            <ErrorMessage name="name" component="div" className="text-xs text-danger" />

            <label htmlFor="email" className="mt-3 text-sm font-medium text-ink">Email</label>
            <Field id="email" name="email" type="email" autoComplete="email" className={fieldClass} />
            <ErrorMessage name="email" component="div" className="text-xs text-danger" />

            <label htmlFor="employeeId" className="mt-3 text-sm font-medium text-ink">Employee ID</label>
            <Field id="employeeId" name="employeeId" type="text" className={fieldClass} />
            <ErrorMessage name="employeeId" component="div" className="text-xs text-danger" />

            <label htmlFor="password" className="mt-3 text-sm font-medium text-ink">Password</label>
            <Field id="password" name="password" type="password" autoComplete="new-password" className={fieldClass} />
            <ErrorMessage name="password" component="div" className="text-xs text-danger" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creating account…" : "Register"}
            </button>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}