import * as yup from "yup";

export const uploadDocumentSchema = yup.object({
  title: yup.string().trim().required("Document title is required"),
  project : yup.string().trim().required("Project ID is required"),
  filename: yup.string().trim().required("Filename is required"),
  mimeType: yup.string().trim().required("MIME type is required"),
  size: yup.number().positive("Size must be a positive number").required("Size is required"),
});
