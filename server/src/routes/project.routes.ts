import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, assignTeamToProject, unassignTeamFromProject} from "../controllers/project.controller.js";
import { submitPreference, viewPreferences } from "../controllers/preference.controller.js";
import { createProjectSchema, updateProjectSchema } from "../validators/project.validator.js";
import { requireRole } from "../middlewares/rbac.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getAllProjects);
router.post("/", requireRole("admin"), validate(createProjectSchema), createProject);
router.get("/:id", getProjectById);
router.put("/:id", requireRole("admin"), validate(updateProjectSchema), updateProject);
router.delete("/:id", requireRole("admin"), deleteProject);
router.post("/:id/teams", requireRole("admin"), assignTeamToProject);
router.delete("/:id/teams/:teamId", requireRole("admin"), unassignTeamFromProject);
router.post("/:id/preference", submitPreference);
router.get("/:id/preferences", viewPreferences);

export default router;
// GET /api/projects "`High` List projects (scoped by role)"
// POST /api/projects "`High` Create project"
// GET /api/projects/:id "`High` Project detail"
// PUT /api/projects/:id "`High` Update project (incl. start/end dates)"
// DELETE /api/projects/:id "`High` Delete project"
// POST /api/projects/:id/teams "`High` Assign team to project"
// DELETE /api/projects/:id/teams/:teamId "`High` Unassign team from project"
// POST /api/projects/:id/preference "`High` Submit/update interest"
// GET /api/projects/:id/preferences "`High` View submitted preferences"
// POST /api/projects/:id/documents "`High` Upload a file (Multer → Cloudflare R2)"
// GET /api/projects/:id/documents "`High` List documents (metadata only)"
// GET /api/projects/:id/documents/:docId/download "`High` Stream/redirect to the file from R2"
// DELETE /api/projects/:id/documents/:docId "`High` Remove a document (metadata + R2 object)"
