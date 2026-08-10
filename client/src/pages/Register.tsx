import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../context/useAuth";

const registerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Name can only contain alphabets and spaces")
    .required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  employeeId: Yup.number()
    .typeError("Employee ID must be a number")
    .integer("Employee ID must be an integer")
    .min(1, "Employee ID must be at least 1")
    .max(2147483647, "Employee ID cannot exceed 2147483647")
    .required("Employee ID is required"),
  password: Yup.string().min(7, "Must be at least 7 characters").required("Password is required"),
  skills: Yup.string(),
});

type FormValues = Yup.InferType<typeof registerSchema>;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
    setServerError("");
    try {
      const skillsArray = values.skills
        ? values.skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      
      await register({
        name: values.name,
        email: values.email,
        employeeId: values.employeeId,
        password: values.password,
        skills: skillsArray,
      });
      navigate("/dashboard");
    } catch (err) {
      if (isAxiosError(err)) {
        setServerError(err.response?.data?.message || "Registration failed");
      } else {
        setServerError("An unexpected error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Create Staffwise Account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <Formik
            initialValues={{ name: "", email: "", employeeId: "", password: "", skills: "" }}
            validationSchema={registerSchema}
            onSubmit={(values, { setSubmitting }) => handleSubmit(values, { setSubmitting } as FormikHelpers<FormValues>)}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                {serverError && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-sm text-red-700">{serverError}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <Field
                    name="name"
                    type="text"
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <ErrorMessage name="name" component="p" className="mt-1 text-xs text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <Field
                    name="email"
                    type="email"
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <ErrorMessage name="email" component="p" className="mt-1 text-xs text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                  <Field
                    name="employeeId"
                    type="number"
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <ErrorMessage name="employeeId" component="p" className="mt-1 text-xs text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Field
                    name="password"
                    type="password"
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <ErrorMessage name="password" component="p" className="mt-1 text-xs text-red-600" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Skills (comma-separated)</label>
                  <Field
                    name="skills"
                    type="text"
                    placeholder="e.g. React, Node.js, Design"
                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <ErrorMessage name="skills" component="p" className="mt-1 text-xs text-red-600" />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? "Creating account..." : "Sign up"}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
