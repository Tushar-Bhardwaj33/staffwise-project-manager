import api from "./api";
import type { IUser } from "../types/user.type";

interface IUserResponse {
  user: IUser;
}

interface IUsersResponse {
  users: IUser[];
}

interface IHistoryResponse {
  history: unknown[]; // replace `unknown[]` with a Preference/history type once one exists client-side
}

export const getAllUsers = async () => {
  const response = await api.get<IUsersResponse>("users");
  return response.data.users;
}

export const getUserById = async (id: IUser["_id"]) => {
  const response = await api.get<IUserResponse>(`users/${id}`);
  return response.data.user;
}

export const updateProfile = async (id: IUser["_id"], userData: Partial<Pick<IUser, "name" | "skills">>) => {
  const response = await api.put<IUserResponse>(`users/${id}`, userData);
  return response.data.user;
}

export const updateRole = async (id: IUser["_id"], role: IUser["role"]) => {
  const response = await api.put<IUserResponse>(`users/${id}/role`, { role });
  return response.data.user;
}

export const getUserHistory = async (id: IUser["_id"]) => {
  const response = await api.get<IHistoryResponse>(`users/${id}/history`);
  return response.data.history;
}