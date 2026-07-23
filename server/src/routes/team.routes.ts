import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  addMemberToTeam,
  removeMemberFromTeam,
} from "../controllers/team.controller.js";
import { createTeamSchema, updateTeamSchema, addMemberSchema } from "../validators/team.validator.js";

const router = Router();

router.use(authMiddleware); // every team route requires a valid token

router.get("/", requireRole("admin"), getAllTeams);
router.post("/", requireRole("admin"), validate(createTeamSchema), createTeam);
router.get("/:id", getTeamById); // employees can view team detail too
router.put("/:id", requireRole("admin"), validate(updateTeamSchema), updateTeam);
router.delete("/:id", requireRole("admin"), deleteTeam);
router.post("/:id/members", requireRole("admin"), validate(addMemberSchema), addMemberToTeam);
router.delete("/:id/members/:userId", requireRole("admin"), removeMemberFromTeam);

export default router;
// GET /api/teams "`High` List teams"
// POST /api/teams "`High` Create a team"
// GET /api/teams/:id "`High` Team detail"
// PUT /api/teams/:id "`High` Edit team"
// DELETE /api/teams/:id "`High` Delete team"
// POST /api/teams/:id/members "`High` Add member to team"
// DELETE /api/teams/:id/members/:userId "`High` Remove member from team"