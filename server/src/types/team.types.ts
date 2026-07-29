import type { Document, Types } from "mongoose";

export interface ITeam extends Document {
  name: string;
  members: Types.ObjectId[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}