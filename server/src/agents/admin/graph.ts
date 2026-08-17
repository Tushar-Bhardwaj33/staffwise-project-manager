import { StateGraph, START, END } from "@langchain/langgraph";
import { AdminAgentState } from "./state.js";
import { fetchProjectContext } from "./nodes/fetchProjectContext.js";
import { summarize } from "./nodes/summarize.js";

export const adminGraph = new StateGraph(AdminAgentState)
  .addNode("fetchProjectContext", fetchProjectContext)
  .addNode("summarize", summarize)
  .addEdge(START, "fetchProjectContext")
  .addEdge("fetchProjectContext", "summarize")
  .addEdge("summarize", END)
  .compile();

import { gatherQaContext } from "./nodes/gatherQaContext.js";
import { qa } from "./nodes/qa.js";

export const adminQaGraph = new StateGraph(AdminAgentState)
  .addNode("gatherQaContext", gatherQaContext)
  .addNode("qa", qa)
  .addEdge(START, "gatherQaContext")
  .addEdge("gatherQaContext", "qa")
  .addEdge("qa", END)
  .compile();
