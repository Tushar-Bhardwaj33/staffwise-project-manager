import mongoose, { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "employee";
  employeeId: number;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
      validate: {
 validator: function (v: string) {
 return /^[\p{L}][\p{L}\p{M}\s'.-]*$/u.test(v);
 },
 message: (props) => `${props.value} contains invalid characters.`
 }
    },
    email: {
 type: String,
 required: true,
 unique: true,
 lowercase: true,
 trim: true,
 match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    employeeId: { 
      type: Number, 
      required: true, 
      unique: true,
      min: [1, "Employee ID must be positive"],
      max: [2147483647, "Employee ID cannot exceed 2147483647"]
    },
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
