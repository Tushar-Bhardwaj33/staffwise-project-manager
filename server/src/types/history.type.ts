import { Types, Document } from "mongoose";

export interface IEmployeeReflection {
  employeeId: Types.ObjectId;
  projectId: Types.ObjectId;
  whatBuilt: string;
  whatWentWell: string;
  whatWentWrong: string;
  skillsGainedOrUsed: string[];
}

export interface PerformanceScores {
  technical: number;
  collaboration: number;
  ownership: number;
}

export interface IAdminValidation {
  adminId: Types.ObjectId;
  projectId: Types.ObjectId;
  employeeId: Types.ObjectId;
  performanceScores: PerformanceScores;
  skillValidation: string[];
  qualitativeNote: string;
}