import api from "./api";

export interface IPreferencePayload {
  interest: "interested" | "not-interested";
  reason?: string;
}

export interface IPreference {
  _id: string;
  project: string;
  employee: { _id: string; name: string; employeeId: string; skills: string[] };
  interest: "interested" | "not-interested";
  reason?: string;
  createdAt: string;
}

export const submitPreference = async (projectId: string, data: IPreferencePayload) => {
  const response = await api.post<{ message: string; preference: IPreference }>(
    `projects/${projectId}/preference`,
    data
  );
  return response.data.preference;
};

export const getProjectPreferences = async (projectId: string) => {
  const response = await api.get<{ preferences: IPreference[] }>(
    `projects/${projectId}/preferences`
  );
  return response.data.preferences;
};

export const getMyPreference = async (projectId: string) => {
  const response = await api.get<{ preference: IPreference | null }>(
    `projects/${projectId}/preferences/mine`
  );
  return response.data.preference;
};
