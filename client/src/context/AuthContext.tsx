import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import * as authService from "../services/auth.service";
import type { IRegisterPayload } from "../services/auth.service";
import { AuthContext } from "./authContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, the token is an httpOnly cookie the browser already holds
  // (if the user has one from a previous session), so we just ask the
  // API who that cookie belongs to.
  useEffect(() => {
    let isMounted = true;

    authService
      .getCurrentUser()
      .then((currentUser) => {
        if (isMounted) setUser(currentUser);
      })
      .catch(() => {
        if (isMounted) setUser(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { user: loggedInUser } = await authService.login(email, password);
    setUser(loggedInUser);
  };

  const register = async (payload: IRegisterPayload) => {
    const { user: registeredUser } = await authService.register(payload);
    setUser(registeredUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
