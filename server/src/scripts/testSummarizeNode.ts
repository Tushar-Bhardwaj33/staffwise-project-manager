// server/src/scripts/testAdminGraph.ts
import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.config.js";
import { adminGraph } from "../agents/admin/graph.js";

const main = async () => {
  await connectDB();

  const result = await adminGraph.invoke({
    query: "tell me about all the team members and their skills",
    projectId: "6a68620d900a4eb5a33bc372",
  });

  console.log("Response:", result.response);

  await mongoose.disconnect();
};

main().catch((err) => {
  console.error("Admin graph test failed:", err);
  process.exit(1);
});
