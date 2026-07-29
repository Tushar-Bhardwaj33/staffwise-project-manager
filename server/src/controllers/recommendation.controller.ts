import type { Request, Response } from "express";
import { getRankedCandidates } from "../services/recommendation.service.js";

export const getProjectRecommendations = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const limit = parseInt(req.query.limit as string) || 5;

    const candidates = await getRankedCandidates(projectId);
    
    res.status(200).json({ candidates: candidates.slice(0, limit) });
  } catch (error: any) {
    console.error("getProjectRecommendations error:", error);
    if (error.message === "PROJECT_NOT_FOUND") {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(500).json({ message: "Something went wrong fetching recommendations" });
  }
};
