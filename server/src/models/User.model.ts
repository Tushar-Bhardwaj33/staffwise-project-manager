import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "employee";
  employeeId: string;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    employeeId: { type: String, required: true, unique: true },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);

// User–-H
// {
// _id:ObjectId,
// name:string,
// email:string, //unique
// passwordHash: string,
// role:'admin' |'employee',
// employeeId:string, //required,unique,human-readable(e.g."1433"),setatregistration
// skills:string[],
// createdAt:Date,
// updatedAt:Date
// }