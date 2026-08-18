import { Schema, model, Document, Types } from "mongoose";
import type { ITeam } from "../types/team.types.js";

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true,  unique: true, trim: true },
    members: { type: [{ type: Schema.Types.ObjectId, ref: "User" }], default: [] },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);


export const Team = model<ITeam>("Team", teamSchema);

//Team–-H
// {
// _id:ObjectId,
// name:string,
// members:ObjectId[], //refUser
// createdBy:ObjectId, //refUser(admin)
// createdAt:Date,
// updatedAt:Date
// }
