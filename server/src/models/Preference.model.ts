import { Schema, model, Document, Types } from "mongoose";

export interface IPreference extends Document {
  project: Types.ObjectId;
  employee: Types.ObjectId;
  interest: "interested" | "not-interested";
  reason?: string;
  createdAt: Date;
}

const preferenceSchema = new Schema<IPreference>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    employee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    interest: {
      type: String,
      enum: ["interested", "not-interested"],
      required: true,
    },
    reason: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // PRD only lists createdAt
);

// Prevents duplicate preferences for the same employee on the same project
preferenceSchema.index({ project: 1, employee: 1 }, { unique: true });

export const Preference = model<IPreference>("Preference", preferenceSchema);

//Preference–-H
// {
// _id:ObjectId,
// project:ObjectId, //refProject
// employee:ObjectId, //refUser
// interest:'interested'|'not-interested',
// reason?:string,
// createdAt:Date
// }
//uniquecompoundindexon(project,employee)
