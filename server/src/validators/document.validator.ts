import * as yup from "yup";

export const uploadDocumentSchema = yup.object({
  title: yup.string().trim().required("Document title is required"),
});