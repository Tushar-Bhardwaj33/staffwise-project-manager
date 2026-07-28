// server/src/controllers/ai.controller.ts
import type { Request, Response } from "express";
import { adminGraph } from "../agents/admin/graph.js";
import { AIQueryLog } from "../models/AIQueryLog.model.js";

export const askAdminSummary = async (req: Request, res: Response) => {
  try {
    const { query, projectId } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!query || !projectId) return res.status(400).json({ message: "query and projectId are required" });

    const result = await adminGraph.invoke({ query, projectId });
    const response = result.response ?? "";

    await AIQueryLog.create({
      user: userId,
      query,
      response,
      context: { projectId },
    });

    res.status(200).json({ response });
  } catch (error) {
    console.error("askAdminSummary error:", error);
    res.status(500).json({ message: "Something went wrong generating the summary" });
  }
};

// server/src/controllers/ai.controller.ts — add alongside askAdminSummary
import { adminQaGraph } from "../agents/admin/graph.js";

export const askAdminQa = async (req: Request, res: Response) => {
  try {
    const { query, projectId, employeeIdentifier } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!query) return res.status(400).json({ message: "query is required" });

    const result = await adminQaGraph.invoke({ query, projectId, employeeIdentifier });
    const response = result.response ?? "";

    await AIQueryLog.create(
      projectId
        ? { user: userId, query, response, context: { projectId } }
        : { user: userId, query, response }
    );

    res.status(200).json({ response });
  } catch (error) {
    console.error("askAdminQa error:", error);
    res.status(500).json({ message: "Something went wrong answering the question" });
  }
};