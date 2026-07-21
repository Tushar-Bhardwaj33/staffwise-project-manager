import { Schema, model, Document, Types } from "mongoose";

export interface ITeam extends Document {
  name: string;
  members: Types.ObjectId[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
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