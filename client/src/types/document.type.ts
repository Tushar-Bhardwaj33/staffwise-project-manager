export interface IProjectDocument {
  _id: string;
  project: string;
  title: string;
  r2Key: string; // internal R2 storage key
  filename: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  createdAt: string;
}