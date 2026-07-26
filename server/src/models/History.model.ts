import mongoose, { Schema } from 'mongoose';
import type { IEmployeeReflection, IAdminValidation } from "../types/history.type.js";

const EmployeeReflectionSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    whatBuilt: {
      type: String,
      required: true,
    },
    whatWentWell: {
      type: String,
      required: true,
    },
    whatWentWrong: {
      type: String,
      required: true,
    },
    skillsGainedOrUsed: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

// one reflection per employee per project
EmployeeReflectionSchema.index({ employeeId: 1, projectId: 1 }, { unique: true });

const AdminValidationSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    performanceScores: {
      technical: { type: Number, min: 1, max: 10, required: true },
      collaboration: { type: Number, min: 1, max: 10, required: true },
      ownership: { type: Number, min: 1, max: 10, required: true },
    },
    skillValidation: {
      type: [String],
      required: true,
    },
    qualitativeNote: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// one validation per employee per project
AdminValidationSchema.index({ employeeId: 1, projectId: 1 }, { unique: true });

export const EmployeeReflection = mongoose.model<IEmployeeReflection>(
  'EmployeeReflection',
  EmployeeReflectionSchema
);

export const AdminValidation = mongoose.model<IAdminValidation>(
  'AdminValidation',
  AdminValidationSchema
);