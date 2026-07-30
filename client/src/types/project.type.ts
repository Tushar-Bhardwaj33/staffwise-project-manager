import type { ITeam } from "./team.type.js";

export type ProjectType = "personal" | "company" | "product" | "client";

export interface IProject {
  _id: string;
  title: string;
  description: string;
  type: ProjectType;
  requiredSkills: string[];
  startDate: string;
  endDate: string;
  assignedTeams: ITeam[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  color?: string;
}
