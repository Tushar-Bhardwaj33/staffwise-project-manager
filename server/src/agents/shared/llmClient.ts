import "dotenv/config.js";
import { ChatOpenAI } from "@langchain/openai";

export const adminLLM = new ChatOpenAI({
  model: "system.ai.claude-sonnet-4-6",
  apiKey: process.env.DATABRICKS_TOKEN,
  configuration: {
    baseURL: `${process.env.DATABRICKS_HOST}/ai-gateway/mlflow/v1`,
  },
  maxTokens: 2000,
  streaming: true,
});