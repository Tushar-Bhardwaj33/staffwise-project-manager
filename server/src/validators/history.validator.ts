import * as yup from 'yup';

export const employeeReflectionSchema = yup.object().shape({
  employeeId: yup.string().required("Employee ID is required"),
  projectId: yup.string().required("Project ID is required"),
  whatBuilt: yup.string().min(10).required("What built is required"),
  whatWentWell: yup.string().min(10).required("What went well is required"),
  whatWentWrong: yup.string().min(10).required("What went wrong is required"),
  skillsGainedOrUsed: yup.array().of(yup.string()).required("Skills gained or used is required"),
});

export const adminValidationSchema = yup.object().shape({
  adminId: yup.string().required("Admin ID is required"),
  projectId: yup.string().required("Project ID is required"),
  employeeId: yup.string().required("Employee ID is required"),
  performanceScores: yup.object().shape({
    technical: yup.number().min(1).max(10).required("Technical score is required"),
    collaboration: yup.number().min(1).max(10).required("Collaboration score is required"),
    ownership: yup.number().min(1).max(10).required("Ownership score is required"),
  }).required("Performance scores are required"),
  skillValidation: yup.array().of(yup.string()).required("Skill validation is required"),
  qualitativeNote: yup.string().min(10).required("Qualitative note is required"),
});
