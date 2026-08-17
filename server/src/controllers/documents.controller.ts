import type { Request, Response } from "express";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET } from "../config/r2Client.config.js";
import { ProjectDocument } from "../models/projectDocument.model.js";
import { Project } from "../models/project.model.js";
import { userCanAccessProject } from "../utils/projectAccess.util.js";
import { Types } from "mongoose";

// --- Access check -----------------------------------------------------
// Per the RBAC table: admin can access any project's documents; an employee
// only if they're a member of one of the teams assigned to that project.
// If you already have this check written for GET /api/projects/:id, reuse
// that function here instead of duplicating it.

// --- POST /api/projects/:id/documents ----------------------------------
export async function uploadDocument(req: Request, res: Response) {
  try{
  const { id: projectId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isAdmin = req.user.role === "admin";

  if(projectId === undefined) {
    return res.status(400).json({ message: "Project id is required" });
  }

  if(typeof projectId !== "string") {
    return res.status(400).json({ message: "Invalid project id" });
  }

  const projectIdObj = new Types.ObjectId(projectId);

  if (!(await userCanAccessProject(req.user.id, projectIdObj, isAdmin))) {
    return res.status(403).json({ message: "Not on a team assigned to this project" });
  }
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const r2Key = `projects/${projectId}/${Date.now()}-${req.file.originalname}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: r2Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    })
  );

  const doc = await ProjectDocument.create({
    project: projectId,
    title: req.body.title || req.file.originalname,
    r2Key,
    filename: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedBy: req.user.id,
  });

  return res.status(201).json(doc);
}
catch (err) {
  console.error("uploadDocument error:", err);
  return res.status(500).json({ message: "Something went wrong uploading the document" });
}}

// --- GET /api/projects/:id/documents -----------------------------------
export async function listDocuments(req: Request, res: Response) {
  try {
  const { id: projectId } = req.params;

  if(!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isAdmin = req.user.role === "admin";

  if(projectId === undefined) {
    return res.status(400).json({ message: "Project id is required" });
  }

  if(typeof projectId !== "string") {
    return res.status(400).json({ message: "Invalid project id" });
  }

  console.log("projectId received:", projectId);
  const projectIdObj = new Types.ObjectId(projectId);

  if (!(await userCanAccessProject(req.user.id, projectIdObj, isAdmin))) {
    return res.status(403).json({ message: "Not on a team assigned to this project" });
  }

  // Metadata only — the PRD is explicit that this endpoint doesn't return file bytes.
  const docs = await ProjectDocument.find({ project: projectIdObj }).sort({ createdAt: -1 });
  return res.status(200).json(docs); 
}
catch (err) {
  console.error("listDocuments error:", err);
  return res.status(500).json({ message: "Something went wrong fetching documents" });
} }

// --- GET /api/projects/:id/documents/:docId/download --------------------
export async function downloadDocument(req: Request, res: Response) {
  try {
  const { id: projectId, docId } = req.params;

    if(!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isAdmin = req.user.role === "admin";

  if(projectId === undefined) {
    return res.status(400).json({ message: "Project id is required" });
  }

  if(typeof projectId !== "string") {
    return res.status(400).json({ message: "Invalid project id" });
  }

  const projectIdObj = new Types.ObjectId(projectId);

  if (!(await userCanAccessProject(req.user.id, projectIdObj, isAdmin))) {
    return res.status(403).json({ message: "Not on a team assigned to this project" });
  }

  const doc = await ProjectDocument.findOne({ _id: docId, project: projectIdObj });
  if (!doc) return res.status(404).json({ message: "Document not found" });

  const object = await r2Client.send(
    new GetObjectCommand({ Bucket: R2_BUCKET, Key: doc.r2Key })
  );

  res.setHeader("Content-Type", doc.mimeType);
  res.setHeader("Content-Disposition", `attachment; filename="${doc.filename}"`);
  (object.Body as NodeJS.ReadableStream).pipe(res);
  res.status(200);
}
catch (err) {
  console.error("downloadDocument error:", err);
  return res.status(500).json({ message: "Something went wrong downloading the document" });
}}

// --- DELETE /api/projects/:id/documents/:docId ---------------------------
export async function deleteDocument(req: Request, res: Response) {
  try{
  const { id: projectId, docId } = req.params;

    if(!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  const isAdmin = req.user.role === "admin";

  if(projectId === undefined) {
    return res.status(400).json({ message: "Project id is required" });
  }

  if(typeof projectId !== "string") {
    return res.status(400).json({ message: "Invalid project id" });
  }
  const projectIdObj = new Types.ObjectId(projectId);
  const doc = await ProjectDocument.findOne({ _id: docId, project: projectIdObj });
  if (!doc) return res.status(404).json({ message: "Document not found" });

  // Admin can delete any doc; employee only their own upload (per RBAC table).
  if (!isAdmin && doc.uploadedBy.toString() !== req.user.id.toString()) {
    return res.status(403).json({ message: "You can only delete your own uploads" });
  }

  await r2Client.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: doc.r2Key }));
  await doc.deleteOne();

  return res.status(204).send();
}
catch (err) {
  console.error("deleteDocument error:", err);
  return res.status(500).json({ message: "Something went wrong deleting the document" });
}}
