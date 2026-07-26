import api from "./api";
import type { IProjectDocument } from "../types/document.type.js";

// server caps uploads at 20MB (see upload.middleware.ts)
// file.size client-side before calling this, for a faster failure than a round trip
export const uploadDocument = async (projectId: string, file: File, title?: string) => {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);

  const response = await api.post<IProjectDocument>(`projects/${projectId}/documents`, formData);
  return response.data;
}

export const listDocuments = async (projectId: string) => {
  // metadata only, by design — this never returns file bytes
  const response = await api.get<IProjectDocument[]>(`projects/${projectId}/documents`);
  return response.data;
}

// triggers a browser download rather than returning JSON — the server streams
// the file bytes directly with a Content-Disposition header
export const downloadDocument = async (projectId: string, docId: string, filename: string) => {
  const response = await api.get(`projects/${projectId}/documents/${docId}/download`, {
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

// 204 No Content on success — nothing to return
export const deleteDocument = async (projectId: string, docId: string) => {
  await api.delete(`projects/${projectId}/documents/${docId}`);
}