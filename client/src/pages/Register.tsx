import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { isAxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import { toast } from "../utils/toast";
import { Input } from "../components/ui/Input";

const registerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  employeeId: Yup.string().required("Employee ID is required"),
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
      toast.success("Account created!", "Welcome to Staffwise.");
      navigate("/dashboard");
    } catch (err) {
      if (isAxiosError(err)) {
        const msg = err.response?.data?.message || "Registration failed";
        setServerError(msg);
        toast.error("Registration Failed", msg);
      } else {
        setServerError("An unexpected error occurred");
        toast.error("Error", "An unexpected error occurred");
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
              <Form className="space-y-4">
                {serverError && (
                  <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-sm text-red-700">{serverError}</p>
                  </div>
                )}

                <Input 
                  name="name" 
                  type="text" 
                  label="Full Name" 
                  placeholder="e.g. Jane Doe" 
                />

                <Input 
                  name="email" 
                  type="email" 
                  label="Email Address" 
                  placeholder="e.g. jane@company.com" 
                />

                <Input 
                  name="employeeId" 
                  type="text" 
                  label="Employee ID" 
                  placeholder="e.g. EMP-001" 
                />

                <Input 
                  name="password" 
                  type="password" 
                  label="Password" 
                  placeholder="Must be at least 7 characters" 
                />

                <Input 
                  name="skills" 
                  type="text" 
                  label="Skills (comma-separated)" 
                  placeholder="e.g. React, Node.js, Design" 
                />

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#20beff] hover:bg-[#0f9fdb] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#20beff] disabled:opacity-50 transition-colors"
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
