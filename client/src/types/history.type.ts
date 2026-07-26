export interface IEmployeeReflection {
  _id: string;
  employeeId: string;
  projectId: string;
  whatBuilt: string;
  whatWentWell: string;
  whatWentWrong: string;
  skillsGainedOrUsed: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IPerformanceScores {
  technical: number;
  collaboration: number;
  ownership: number;
}

export interface IAdminValidation {
  _id: string;
  adminId: string;
  projectId: string;
  employeeId: string;
  performanceScores: IPerformanceScores;
  skillValidation: string[];
  qualitativeNote: string;
  createdAt: string;
  updatedAt: string;
}

// what the client actually needs to send to POST /reflections.
// employeeId is required by the backend's yup schema but gets overwritten
// server-side from the token regardless — pass the current user's id anyway.
export type IReflectionPayload = Pick<
  IEmployeeReflection,
  "employeeId" | "projectId" | "whatBuilt" | "whatWentWell" | "whatWentWrong" | "skillsGainedOrUsed"
>;

// same story for adminId on POST /validations
export type IValidationPayload = Pick<
  IAdminValidation,
  "adminId" | "projectId" | "employeeId" | "performanceScores" | "skillValidation" | "qualitativeNote"
>;