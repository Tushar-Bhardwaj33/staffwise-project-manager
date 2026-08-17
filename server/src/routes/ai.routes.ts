// server/src/routes/ai.routes.ts
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { askAdminQa, askAdminSummary, askEmployeeQuery } from "../controllers/ai.controller.js";
const router = Router();

router.use(authMiddleware);
router.post("/query", requireRole("employee"), askEmployeeQuery);
router.post("/admin/summarize", requireRole("admin"), askAdminSummary);
router.post("/admin/qa", requireRole("admin"), askAdminQa);
export default router;
