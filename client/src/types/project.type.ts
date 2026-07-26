import { Types } from "mongoose";
import type { ITeam } from "./team.type.js";

export interface IProject {
  _id: Types.ObjectId;
  title: string;
  description: string;
  type: "personal" | "company" | "client" | "internal";
  requiredSkills: string[];
  startDate: Date;
  endDate: Date;
  assignedTeams: ITeam[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  _v: number;
}