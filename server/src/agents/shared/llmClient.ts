import "dotenv/config.js";
import { ChatOpenAI } from "@langchain/openai";

if(!process.env.DATABRICKS_MODEL || !process.env.DATABRICKS_TOKEN || !process.env.DATABRICKS_HOST) {
  throw new Error("Missing required environment variables for Databricks LLM configuration.");
}

export const adminLLM = new ChatOpenAI({
  model: process.env.DATABRICKS_MODEL,
  apiKey: process.env.DATABRICKS_TOKEN,
  configuration: {
    baseURL: `${process.env.DATABRICKS_HOST}/ai-gateway/mlflow/v1`,
  },
  maxTokens: 2000,
});