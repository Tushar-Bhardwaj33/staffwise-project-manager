import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import { AuthCard } from "../components/AuthCard.js";

interface LoginFormValues {
  email: string;
  password: string;
}

const loginSchema = Yup.object({
  email: Yup.string().trim().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const fieldClass =
  "rounded-md border border-border px-3 py-2 text-sm text-ink outline-none focus:ring-2 focus:ring-brand";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState<string | null>(null);

  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? "/";

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (err) {
      const message = isAxiosError<{ message?: string }>(err)
        ? err.response?.data?.message ?? "Invalid email or password"
        : "Something went wrong. Please try again.";
      setServerError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Log in"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-medium text-brand hover:underline">
            Register
          </Link>
        </>
      }
    >
      {serverError && (
        <p role="alert" className="mb-4 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          {serverError}
        </p>
      )}

      <Formik<LoginFormValues>
        initialValues={{ email: "", password: "" }}
        validationSchema={loginSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-1" noValidate>
            <label htmlFor="email" className="mt-3 text-sm font-medium text-ink">
              Email
            </label>
            <Field id="email" name="email" type="email" autoComplete="email" className={fieldClass} />
            <ErrorMessage name="email" component="div" className="text-xs text-danger" />

            <label htmlFor="password" className="mt-3 text-sm font-medium text-ink">
              Password
            </label>
            <Field
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className={fieldClass}
            />
            <ErrorMessage name="password" component="div" className="text-xs text-danger" />

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Logging in…" : "Log in"}
            </button>
          </Form>
        )}
      </Formik>
    </AuthCard>
  );
}