import api from "./api";
import type { IProject } from "../types/project.type";
import type { ITeam } from "../types/team.type";

interface IProjectResponse {
  project: IProject;
}

interface IProjectsResponse {
  projects: IProject[];
}

export const getAllProjects = async () => {
  const response = await api.get<IProjectsResponse>("projects");
  return response.data.projects;
}

export const createProject = async (projectData: Omit<IProject, "_id" | "createdAt" | "updatedAt" | "__v">) => {
  const response = await api.post<IProjectResponse>("projects", projectData);
  return response.data.project;
}

export  const getProjectById = async (id: IProject["_id"]) => {
  const response = await api.get<IProjectResponse>(`projects/${id}`);
  return response.data.project;
}

export const updateProject = async (id: IProject["_id"], projectData: Partial<Omit<IProject, "_id" | "createdAt" | "updatedAt" | "__v">>) => {
  const response = await api.put<IProjectResponse>(`projects/${id}`, projectData);
  return response.data.project;
}

export const deleteProject = async (id: IProject["_id"]) => {
  const response = await api.delete<{ message: string }>(`projects/${id}`);
  return response.data.message;
}

export const assignTeamToProject = async (projectId: IProject["_id"], teamId: ITeam["_id"]) => {
  const response = await api.post<IProjectResponse>(`projects/${projectId}/teams`, { teamId });
  return response.data.project;
}

export const removeTeamFromProject = async (projectId: IProject["_id"], teamId: ITeam["_id"]) => {
  const response = await api.delete<IProjectResponse>(`projects/${projectId}/teams/${teamId}`);
  return response.data.project;
}