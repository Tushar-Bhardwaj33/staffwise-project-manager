import { createContext } from "react";
import type { IRegisterPayload } from "./services/auth.service";
import type { IUser } from "./types/user.type";

export interface AuthContextValue {
  user: IUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: IRegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);