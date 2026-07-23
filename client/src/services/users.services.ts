import api from "./api.js";
import type { IUser } from "../types/user.type.js";

export const getAllUsers = async () => {
  const response = await api.get<{ users: IUser[] }>("users");
  return response.data.users;
}

export const getUserById = async (id: IUser["_id"]) => {
  const response = await api.get<IUser>(`users/${id}`);
  return response.data;
}

export const updateProfile = async (id: IUser["_id"], userData: Partial<IUser>) => {
  const response = await api.put<IUser>(`users/${id}`, userData);
  return response.data;
}

export const updateRole = async (id: IUser["_id"], role: IUser["role"]) => {
  const response = await api.put<IUser>(`users/${id}/role`, { role });
  return response.data;
}

export const getUserHistory = async (id: IUser["_id"]) => {
  const response = await api.get(`users/${id}/history`);
  return response.data;
}