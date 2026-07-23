import * as yup from "yup";

const objectIdString = yup
  .string()
  .matches(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createTeamSchema = yup.object({
  name: yup.string().trim().required("Team name is required"),
});

export const updateTeamSchema = createTeamSchema.partial();

export const addMemberSchema = yup.object({
  userId: objectIdString.required("userId is required"),
});