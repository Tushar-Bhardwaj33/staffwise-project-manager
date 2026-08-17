import type { Request, Response } from "express";
import { adminGraph, adminQaGraph } from "../agents/admin/graph.js";
import { AIQueryLog } from "../models/aiQueryLog.model.js";
import { User } from "../models/user.model.js";
import { getProjectsForEmployee } from "../services/employee.service.js";

function extractTextFromResponse(response: any): string {
  if (typeof response === "string") return response;
  if (Array.isArray(response)) {
    const textBlock = response.find((block: any) => block.type === "text");
    if (textBlock && textBlock.text) return textBlock.text;
    return JSON.stringify(response);
  }
  return String(response || "");
}

export const askAdminSummary = async (req: Request, res: Response) => {
  try {
    const { query, projectId } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!query || !projectId) return res.status(400).json({ message: "query and projectId are required" });

    const user = await User.findById(userId);
    const result = await adminGraph.invoke({ query, projectId, currentUser: user });
    const response = extractTextFromResponse(result.response);

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


export const askAdminQa = async (req: Request, res: Response) => {
  try {
    const { query, projectId, employeeIdentifier } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!query) return res.status(400).json({ message: "query is required" });

    // Fetch server-side memory
    const queryFilter: any = { user: userId };
    if (projectId) queryFilter["context.projectId"] = projectId;
    else queryFilter["context.projectId"] = { $exists: false };

    const logs = await AIQueryLog.find(queryFilter).sort({ createdAt: 1 }).limit(10).lean();
    const history: { role: string; content: string }[] = [];
    for (const log of logs) {
      history.push({ role: "user", content: log.query });
      history.push({ role: "assistant", content: log.response });
    }

    const user = await User.findById(userId);
    const result = await adminQaGraph.invoke({ query, projectId, employeeIdentifier, currentUser: user, history });
    const response = extractTextFromResponse(result.response);

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

export const askEmployeeQuery = async (req: Request, res: Response) => {
  try {
    const { query, projectId } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!query) return res.status(400).json({ message: "query is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (projectId) {
      const allowedProjects = await getProjectsForEmployee(userId);
      const isAllowed = allowedProjects.some(p => p._id.toString() === projectId);
      if (!isAllowed) {
        return res.status(403).json({ message: "You don't have access to this project" });
      }
    }

    // Fetch server-side memory
    const queryFilter: any = { user: userId };
    if (projectId) queryFilter["context.projectId"] = projectId;
    else queryFilter["context.projectId"] = { $exists: false };

    const logs = await AIQueryLog.find(queryFilter).sort({ createdAt: 1 }).limit(10).lean();
    const history: { role: string; content: string }[] = [];
    for (const log of logs) {
      history.push({ role: "user", content: log.query });
      history.push({ role: "assistant", content: log.response });
    }

    const result = await adminQaGraph.invoke({ 
      query, 
      projectId: projectId || undefined, 
      employeeIdentifier: user.employeeId,
      currentUser: user,
      history 
    });
    
    const response = extractTextFromResponse(result.response);

    await AIQueryLog.create(
      projectId
        ? { user: userId, query, response, context: { projectId } }
        : { user: userId, query, response }
    );

    res.status(200).json({ response });
  } catch (error) {
    console.error("askEmployeeQuery error:", error);
    res.status(500).json({ message: "Something went wrong answering the query" });
  }
};
