import { useState } from "react";
import type { FormEvent } from "react";
import { login, register } from "../services/auth.service.js";
import type { IUser } from "../types/user.type.js";
import "../app.css";

type Mode = "login" | "register";

interface AuthCardProps {
  initialMode?: Mode;
  onAuthSuccess?: (user: IUser) => void;
}

const AuthCard = ({ initialMode = "login", onAuthSuccess }: AuthCardProps) => {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    employeeId: "",
    password: "",
  });

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const extractErrorMessage = (err: unknown, fallback: string) => {
    if (err && typeof err === "object" && "response" in err) {
      const response = (err as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) return response.data.message;
    }
    return fallback;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user } = await login(loginForm.email, loginForm.password);
      onAuthSuccess?.(user);
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't sign you in. Check your email and password."));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user } = await register({
        ...registerForm,
        employeeId: Number(registerForm.employeeId)
      });
      onAuthSuccess?.(user);
    } catch (err) {
      setError(extractErrorMessage(err, "Couldn't create your account. Double check your details."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card-wrap">
        <div className="auth-card">
          <div className="auth-shape auth-shape--square" />
          <div className="auth-shape auth-shape--triangle" />
          <div className="auth-shape auth-shape--circle" />

          <div className="auth-card__inner">
            <p className="auth-wordmark">
              staff<span>wise</span>
            </p>
            <h1 className="auth-heading">Welcome!</h1>

            <div className="auth-tabs" role="tablist" aria-label="Sign in or register">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                className="auth-tab"
                onClick={() => switchMode("login")}
              >
                Sign In
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "register"}
                className="auth-tab"
                onClick={() => switchMode("register")}
              >
                Register
              </button>
            </div>

            {error && <p className="auth-error">{error}</p>}

            {mode === "login" ? (
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="auth-field">
                  <label htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="login-password">Password</label>
                  <input
                    id="login-password"
                    type="password"
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                </div>
                <button className="auth-submit" type="submit" disabled={loading}>
                  {loading ? "Signing in…" : "Sign In"}
                </button>
                <p className="auth-switch">
                  Don't have an account?{" "}
                  <button type="button" onClick={() => switchMode("register")}>
                    Create one
                  </button>
                </p>
              </form>
            ) : (
              <form className="auth-form" onSubmit={handleRegister}>
                <div className="auth-field">
                  <label htmlFor="register-name">Full name</label>
                  <input
                    id="register-name"
                    type="text"
                    required
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="Jordan Rivera"
                    autoComplete="name"
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="register-email">Email</label>
                  <input
                    id="register-email"
                    type="email"
                    required
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="register-employee-id">Employee ID</label>
                  <input
                    id="register-employee-id"
                    type="text"
                    required
                    value={registerForm.employeeId}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, employeeId: e.target.value })
                    }
                    placeholder="1433"
                  />
                  <small>Ask your admin if you don't have one yet.</small>
                </div>
                <div className="auth-field">
                  <label htmlFor="register-password">Password</label>
                  <input
                    id="register-password"
                    type="password"
                    required
                    minLength={6}
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm({ ...registerForm, password: e.target.value })
                    }
                    placeholder="At least 6 characters"
                    autoComplete="new-password"
                  />
                </div>
                <button className="auth-submit" type="submit" disabled={loading}>
                  {loading ? "Creating account…" : "Register"}
                </button>
                <p className="auth-switch">
                  Have an account?{" "}
                  <button type="button" onClick={() => switchMode("login")}>
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        <p className="auth-footnote">
          Staffwise accounts are provisioned for your organization. Your employee ID links you to
          the projects and teams your admin has assigned you to.
        </p>
        <span className="auth-support">
          <a href="mailto:support@staffwise.app">Contact Us / Support</a>
        </span>
      </div>
    </div>
  );
};

export default AuthCard;