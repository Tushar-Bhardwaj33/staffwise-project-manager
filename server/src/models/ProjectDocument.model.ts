import { Schema, model, Types } from "mongoose";

export interface IProjectDocument {
  project: Types.ObjectId;
  title: string;
  r2Key: string;
  filename: string;
  mimeType: string;
  size: number;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
}

const projectDocumentSchema = new Schema<IProjectDocument>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true, index: true },
    title: { type: String, required: true },
    r2Key: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ProjectDocument = model<IProjectDocument>("ProjectDocument", projectDocumentSchema);
