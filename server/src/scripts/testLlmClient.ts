// server/src/scripts/testLlmClient.ts
import "dotenv/config";
import { adminLLM } from "../agents/shared/llmClient.js";

const main = async () => {
  const result = await adminLLM.invoke([{ role: "user", content: "how are you?" }]);
  console.log("Response:", result.content);
};

main().catch((err) => {
  console.error("LLM client test failed:", err);
  process.exit(1);
});