import * as yup from "yup";

export const createCommentSchema = yup.object({
  content: yup.string().trim().required("Content is required"),
  parentComment: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid parent comment ID")
    .optional(),
});

export const createTopicSchema = yup.object({
  project: yup.string().required("Project ID is required"),
  author: yup.string().required("Author is required"),
  title: yup.string().trim().required("Title is required"),
  content: yup.string().trim().required("content is required"),
});

export const editTopicSchema = yup
  .object({
    title: yup.string().trim().min(1),
    content: yup.string().trim().min(1),
  })
  .test(
    "at-least-one-field",
    "At least one of title or content must be provided",
    (value) => Boolean(value?.title || value?.content)
  );

export const editCommentSchema = yup.object({
  content: yup.string().trim().min(1).required("Content is required"),
});