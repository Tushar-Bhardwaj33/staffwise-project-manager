import * as yup from "yup";

export const submitPreferenceSchema = yup.object({
  interest: yup
    .mixed<"interested" | "not-interested">()
    .oneOf(["interested", "not-interested"], "Invalid interest value")
    .required("Interest is required"),
  reason: yup.string().trim().optional(),
});