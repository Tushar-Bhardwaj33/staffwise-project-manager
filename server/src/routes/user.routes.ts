import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAllUsers, getUserById, updateProfile, updateRole, getUserHistory} from "../controllers/user.controller.js";
import { updateRoleSchema, updateProfileSchema } from "../validators/user.validator.js";
import {requireRole} from "../middlewares/rbac.middleware.js";

const router = Router();

router.get("/", authMiddleware, requireRole("admin"), getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.put("/:id", authMiddleware, validate(updateProfileSchema), updateProfile);
router.put("/:id/role", authMiddleware, requireRole("admin"), validate(updateRoleSchema), updateRole);
router.get("/:id/history", authMiddleware, getUserHistory);


export default router;

// GET /api/users "`High` List all employees"
// GET /api/users/:id "`High` Get profile"
// PUT /api/users/:id "`High` Update profile/skills"
// PUT /api/users/:id/role "`High` Change role"
// GET /api/users/:id/history "`High` Past projects for a user"