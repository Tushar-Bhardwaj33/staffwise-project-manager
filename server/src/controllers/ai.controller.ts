import type { Request, Response } from "express";
import { adminGraph, adminQaGraph } from "../agents/admin/graph.js";
import { AIQueryLog } from "../models/AIQueryLog.model.js";
import { User } from "../models/User.model.js";
import { getProjectsForEmployee } from "../services/employee.service.js";

const injectInteractables = (messages: any[]) => {
  if (!messages || !Array.isArray(messages)) return;
  for (const msg of messages) {
    if (msg.role !== "user") continue;
    
    // assistant-ui stores snapshots in metadata.custom.interactables or annotations
    let interactables = msg.metadata?.custom?.interactables;
    if (!interactables) {
      const ann = msg.annotations?.find((a: any) => a?.type === "interactables");
      if (ann) interactables = ann.data;
    }
                          
    if (!interactables || !Array.isArray(interactables)) continue;
    
    const formatted = interactables.map((entry: any) => {
      if (entry.partial) {
        return `[State of "${entry.name}" (id: "${entry.id}") changed — updated fields: ${JSON.stringify(entry.state)}; fields not listed are unchanged]`;
      }
      return `[Current state of "${entry.name}" (id: "${entry.id}"): ${JSON.stringify(entry.state)}]`;
    }).join("\n");
    
    if (formatted) {
      msg.content = `${formatted}\n\n${msg.content}`;
    }
  }
};

export const askAdminSummary = async (req: Request, res: Response) => {
  try {
    const { query, projectId } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!query || !projectId) return res.status(400).json({ message: "query and projectId are required" });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("x-vercel-ai-data-stream", "v1");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const user = await User.findById(userId);
    let fullResponse = "";

    const callbacks = [{
      handleLLMNewToken(token: string) {
        fullResponse += token;
        res.write(`0:${JSON.stringify(token)}\n`);
      }
    }];

    await adminGraph.invoke(
      { query, projectId, currentUser: user },
      { callbacks }
    );

    await AIQueryLog.create({
      user: userId,
      query,
      response: fullResponse,
      context: { projectId },
    });

    // No DONE marker needed for DataStream, ending the response is enough
    res.end();
    res.end();
  } catch (error) {
    console.error("askAdminSummary error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Something went wrong generating the summary" });
    } else {
      res.end();
    }
  }
};


export const askAdminQa = async (req: Request, res: Response) => {
  try {
    const { projectId, employeeIdentifier } = req.body;
    const userId = req.user?.id;
    const messages = req.body.messages;
    if (messages) injectInteractables(messages);
    const query = req.body.query || (messages && messages.length > 0 ? messages[messages.length - 1].content : undefined);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!query) return res.status(400).json({ message: "query or messages is required" });

    // Fetch server-side memory
    const queryFilter: any = { user: userId };
    if (projectId) queryFilter["context.projectId"] = projectId;
    else queryFilter["context.projectId"] = { $exists: false };

    const logs = await AIQueryLog.find(queryFilter).sort({ createdAt: 1 }).limit(10).lean();
    const history: { role: string; content: string }[] = [];
    for (const log of logs) {
      if (log.query && log.response) {
        history.push({ role: "user", content: log.query });
        history.push({ role: "assistant", content: log.response });
      }
    }

    const user = await User.findById(userId);
    let fullResponse = "";

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("x-vercel-ai-data-stream", "v1");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const callbacks = [{
      handleLLMNewToken(token: string) {
        fullResponse += token;
        res.write(`0:${JSON.stringify(token)}\n`);
      },
      handleToolStart(tool: any, input: string, runId: string) {
        let args = {};
        try { args = JSON.parse(input); } catch (e) {}
        const toolName = tool?.id?.[tool.id.length - 1] || "tool";
        res.write(`9:${JSON.stringify({ toolCallId: runId, toolName, args })}\n`);
      },
      handleToolEnd(output: string, runId: string) {
        res.write(`a:${JSON.stringify({ toolCallId: runId, result: output })}\n`);
      }
    }];

    await adminQaGraph.invoke(
      { query, projectId, employeeIdentifier, currentUser: user, history },
      { callbacks }
    );

    await AIQueryLog.create(
      projectId
        ? { user: userId, query, response: fullResponse, context: { projectId } }
        : { user: userId, query, response: fullResponse }
    );

    res.end();
  } catch (error) {
    console.error("askAdminQa error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Something went wrong answering the question" });
    } else {
      res.end();
    }
  }
};

export const askEmployeeQuery = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.body;
    const userId = req.user?.id;
    const messages = req.body.messages;
    if (messages) injectInteractables(messages);
    const query = req.body.query || (messages && messages.length > 0 ? messages[messages.length - 1].content : undefined);

    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!query) return res.status(400).json({ message: "query or messages is required" });

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
      if (log.query && log.response) {
        history.push({ role: "user", content: log.query });
        history.push({ role: "assistant", content: log.response });
      }
    }

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("x-vercel-ai-data-stream", "v1");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";
    const callbacks = [{
      handleLLMNewToken(token: string) {
        fullResponse += token;
        res.write(`0:${JSON.stringify(token)}\n`);
      },
      handleToolStart(tool: any, input: string, runId: string) {
        let args = {};
        try { args = JSON.parse(input); } catch (e) {}
        const toolName = tool?.id?.[tool.id.length - 1] || "tool";
        res.write(`9:${JSON.stringify({ toolCallId: runId, toolName, args })}\n`);
      },
      handleToolEnd(output: string, runId: string) {
        res.write(`a:${JSON.stringify({ toolCallId: runId, result: output })}\n`);
      }
    }];

    await adminQaGraph.invoke({ 
      query, 
      projectId: projectId || undefined, 
      employeeIdentifier: user.employeeId,
      currentUser: user,
      history 
    }, { callbacks });
    
    await AIQueryLog.create(
      projectId
        ? { user: userId, query, response: fullResponse, context: { projectId } }
        : { user: userId, query, response: fullResponse }
    );

    res.end();
  } catch (error) {
    console.error("askEmployeeQuery error:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Something went wrong answering the query" });
    } else {
      res.end();
    }
  }
};