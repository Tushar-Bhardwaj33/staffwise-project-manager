import * as yup from "yup";

export const createCommentSchema = yup.object({
  title: yup.string().trim().when("parentComment", {
    is: (val: string | undefined) => !val,
    then: (schema) => schema.required("Title is required for top-level topics"),
    otherwise: (schema) => schema.notRequired(),
  }),
  content: yup.string().trim().required("Content is required"),
  parentComment: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid parent comment ID")
    .optional(),
});