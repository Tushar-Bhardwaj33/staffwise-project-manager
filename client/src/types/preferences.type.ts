import { Types } from "mongoose";
import type { IProject } from "./project.type.js";

export interface IPreference {
  _id: Types.ObjectId;
  project: Types.ObjectId | IProject;
  employee: Types.ObjectId;
  interest: "interested" | "not_interested";
  reason: string;
  createdAt: Date;
  __v: number;
}