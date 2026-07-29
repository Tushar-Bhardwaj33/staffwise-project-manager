import "dotenv/config.js";
import { adminQaGraph } from "./agents/admin/graph.js";

async function run() {
  try {
    const res = await adminQaGraph.invoke({ query: "hi" });
    console.log("Result:", res);
  } catch (err) {
    console.error("Error:", err);
  }
}
run();
