import api from "./api.js";
import type { ITeam } from "../types/team.type.js";

export const getAllTeams = async () => {
  const response = await api.get<{ teams?: Partial<ITeam>[] }>("teams");
  return response.data.teams ?? response.data;
}

export const getTeamById = async (id: ITeam["_id"]) => {
  const response = await api.get<{ team?: Partial<ITeam> }>(`teams/${id}`);
  return response.data.team ?? response.data;
}

export const createTeam = async (teamData: Omit<ITeam, "_id" | "createdAt" | "updatedAt">) => {
  const response = await api.post<{ team?: Partial<ITeam> }>("teams", teamData);
  return response.data.team ?? response.data;
}

export const updateTeam = async (id: ITeam["_id"], teamData: Partial<Omit<ITeam, "_id" | "createdAt" | "updatedAt">>) => {
  const response = await api.put<{ team?: Partial<ITeam> }>(`teams/${id}`, teamData);
  return response.data.team ?? response.data;
}

export const deleteTeam = async (id: ITeam["_id"]) => {
  const response = await api.delete<{ message?: string }>(`teams/${id}`);
  return response.data;
}

export const addMemberToTeam = async (id: ITeam["_id"], memberId: string) => {
  const response = await api.post<{ team?: Partial<ITeam> }>(`teams/${id}/members`, { userId: memberId });
  return response.data.team ?? response.data;
}

export const removeMemberFromTeam = async (id: ITeam["_id"], memberId: string) => {
  const response = await api.delete<{ team?: Partial<ITeam> }>(`teams/${id}/members/${memberId}`);
  return response.data.team ?? response.data;
}