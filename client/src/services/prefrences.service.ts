import api from "./api";
import type { IPreference } from "../types/preferences.type.js";
import type { IProject } from "../types/project.type.js";

interface IPreferenceResponse {
  message: string;
  preference: IPreference;
}

export const createPreference = async (preferenceData: Omit<IPreference, "_id" | "createdAt" | "__v">) => {
  const response = await api.post<IPreferenceResponse>("project/preferences", preferenceData);
  return response.data.preference;
}

export const getPreferencesByProjectId = async (id: IProject["_id"]) => {
  const response = await api.get<IPreferenceResponse>(`project/preferences/${id}`);
  return response.data.preference;
}