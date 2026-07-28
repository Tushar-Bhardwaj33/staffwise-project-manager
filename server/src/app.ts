import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import teamRoutes from "./routes/team.routes.js";
import projectRoutes from "./routes/project.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import documentsRouter from "./routes/documents.routes.js";
import discussionsRouter from "./routes/discussions.routes.js";
import historyRouter from "./routes/history.routes.js";
import preferenceRouter from "./routes/preference.routes.js";
import aiRoutes from "./routes/ai.routes.js";

process.env.FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const FRONTEND_URL = process.env.FRONTEND_URL;
const app = express();

// app.use(cors({ origin: true, credentials: true }));
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerDocument = YAML.load(path.join(__dirname, "..", "swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  res.send("Welcome to the StaffWise API!");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/projects/:id/documents", documentsRouter);
app.use("/api/projects/:id/preferences", preferenceRouter);
app.use("/api/projects/:id/discussions", discussionsRouter);
app.use("/api/history", historyRouter);
// ...
app.use("/api/ai", aiRoutes);

app.use(errorMiddleware);

export default app;