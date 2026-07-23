import api from "./api";
import type { IUser } from "../types/user.type";

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  employeeId: string;
}

interface IAuthResponse {
  "user": IUser;
}

export const login = async (email: IUser["email"], password: string) => {
  const response = await api.post<IAuthResponse>("auth/login", { email, password });
  return response.data;
}

export const register = async (user: IRegisterPayload) => {
  const response = await api.post<IAuthResponse>("auth/register", user);
  return response.data;
}

export const logout = async () => {
  const response = await api.post("auth/logout");
  return response.data;
}

export const getCurrentUser = async () => {
  const response = await api.get<IUser>("auth/me");
  return response.data;
}