import {Types} from "mongoose";

export type ProjectId = string;

export interface IProject extends Document {
  title: string;
  description: string;
  type: "personal" | "company" | "product" | "client";
  requiredSkills: string[];
  startDate: Date;
  endDate: Date;
  assignedTeams: Types.ObjectId[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}