import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyProjects from "./pages/MyProjects";
import AIAssistant from "./pages/AIAssistant";
import ProjectList from "./pages/projects/ProjectList";
import ProjectDetail from "./pages/projects/ProjectDetail";
import Employees from "./pages/admin/Employees";
import EmployeeDetail from "./pages/admin/EmployeeDetail";
import Teams from "./pages/admin/Teams";
import TeamDetail from "./pages/admin/TeamDetail";
import NewProject from "./pages/admin/NewProject";
import ManageProject from "./pages/admin/ManageProject";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Authenticated — wrapped in the app shell */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />

        {/* Employee only */}
        <Route
          path="/my-projects"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MyProjects />
            </ProtectedRoute>
          }
        />

        {/* Admin only */}
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Employees />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EmployeeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teams"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Teams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/teams/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TeamDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/new"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <NewProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects/:id/manage"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <ManageProject />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
