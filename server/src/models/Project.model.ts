import { Schema, model, Document, Types } from "mongoose";

import type { IProject } from "../types/project.types.js";

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["personal", "company", "product", "client"],
      required: true,
    },
    requiredSkills: { type: [String], default: [] },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    assignedTeams: [{ type: Schema.Types.ObjectId, ref: "Team" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", projectSchema);

//Project–-H
// {
// _id:ObjectId,
// title:string,
// description:string,
// type:'personal'|'company'|'product'|'client',
// requiredSkills:string[],
// startDate:Date,
// endDate:Date,
// assignedTeams:ObjectId[], //refTeam
// createdBy:ObjectId, //refUser(admin)
// createdAt:Date,
// updatedAt:Date
// }