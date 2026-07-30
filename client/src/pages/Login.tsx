import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import { toast } from "../utils/toast";
import { Input } from "../components/ui/Input";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
});

type FormValues = Yup.InferType<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [serverError, setServerError] = useState("");

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setServerError("");
    try {
      await login(values.email, values.password);
      toast.success("Welcome back!", "You have successfully signed in.");
      navigate(from, { replace: true });
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message || "Login failed";
        setServerError(msg);
        toast.error("Login Failed", msg);
      } else {
        setServerError("An unexpected error occurred");
        toast.error("Error", "An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow border border-gray-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
            Sign in to Staffwise
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new employee account
            </Link>
          </p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {serverError && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <p className="text-sm text-red-700">{serverError}</p>
                </div>
              )}

              <Input 
                name="email" 
                type="email" 
                label="Email address" 
                placeholder="Enter your email" 
              />

              <Input 
                name="password" 
                type="password" 
                label="Password" 
                placeholder="Enter your password" 
              />

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#20beff] hover:bg-[#0f9fdb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#20beff] disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}