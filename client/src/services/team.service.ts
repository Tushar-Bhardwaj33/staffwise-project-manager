import api from "./api";
import type { ITeam } from "../types/team.type";

interface ITeamResponse {
  team: ITeam;
}

interface ITeamsResponse {
  teams: ITeam[];
}

interface IMessageResponse {
  message: string;
}

export const getAllTeams = async () => {
  const response = await api.get<ITeamsResponse>("teams");
  return response.data.teams;
}

export const getTeamById = async (id: ITeam["_id"]) => {
  const response = await api.get<ITeamResponse>(`teams/${id}`);
  return response.data.team;
}

export const createTeam = async (teamData: Omit<ITeam, "_id" | "createdAt" | "updatedAt" | "__v">) => {
  const response = await api.post<ITeamResponse>("teams", teamData);
  return response.data.team;
}

export const updateTeam = async (id: ITeam["_id"], teamData: Partial<Omit<ITeam, "_id" | "createdAt" | "updatedAt" | "__v">>) => {
  const response = await api.put<ITeamResponse>(`teams/${id}`, teamData);
  return response.data.team;
}

export const deleteTeam = async (id: ITeam["_id"]) => {
  const response = await api.delete<IMessageResponse>(`teams/${id}`);
  return response.data;
}

export const addMemberToTeam = async (id: ITeam["_id"], memberId: string) => {
  const response = await api.post<ITeamResponse>(`teams/${id}/members`, { userId: memberId });
  return response.data.team;
}

export const removeMemberFromTeam = async (id: ITeam["_id"], memberId: string) => {
  const response = await api.delete<ITeamResponse>(`teams/${id}/members/${memberId}`);
  return response.data.team;
}