import api from "./api";
import type {
  IEmployeeReflection,
  IAdminValidation,
  IReflectionPayload,
  IValidationPayload,
} from "../types/history.type";

interface IReflectionResponse {
  message: string;
  reflection: IEmployeeReflection;
}

interface IReflectionsResponse {
  reflections: IEmployeeReflection[];
}

interface IValidationResponse {
  message: string;
  validation: IAdminValidation;
}

interface IValidationsResponse {
  validations: IAdminValidation[];
}

interface ISkillsResponse {
  skills: string[];
}

export const submitReflection = async (payload: IReflectionPayload) => {
  const response = await api.post<IReflectionResponse>("history/reflections", payload);
  return response.data.reflection;
}

export const submitValidation = async (payload: IValidationPayload) => {
  const response = await api.post<IValidationResponse>("history/validations", payload);
  return response.data.validation;
}

// admin-only
export const getReflectionsByProject = async (projectId: string) => {
  const response = await api.get<IReflectionsResponse>(`history/reflections/project/${projectId}`);
  return response.data.reflections;
}

export const getReflectionByEmployeeAndProject = async (employeeId: string, projectId: string) => {
  const response = await api.get<{ reflection: IEmployeeReflection }>(
    `history/reflections/${employeeId}/${projectId}`
  );
  return response.data.reflection;
}

export const getValidationsByEmployeeAndProject = async (employeeId: string, projectId: string) => {
  const response = await api.get<IValidationsResponse>(`history/validations/${employeeId}/${projectId}`);
  return response.data.validations;
}

// admin-only — returns the calling admin's own validation (adminId comes from the token)
export const getMyValidation = async (employeeId: string, projectId: string) => {
  const response = await api.get<{ validation: IAdminValidation }>(
    `history/validations/mine/${employeeId}/${projectId}`
  );
  return response.data.validation;
}

export const getValidatedSkillsByEmployeeAndProject = async (employeeId: string, projectId: string) => {
  const response = await api.get<ISkillsResponse>(`history/skills/${employeeId}/${projectId}`);
  return response.data.skills;
}