import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <p className="flex min-h-screen items-center justify-center text-sm text-ink-soft">
        Checking session…
      </p>
    );
  }

  // If the user is already logged in, don't allow access
  // to login/register pages.
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}