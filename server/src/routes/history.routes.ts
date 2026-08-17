import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole, isSelfOrAdmin } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { employeeReflectionSchema, adminValidationSchema } from "../validators/history.validator.js";
import {
  submitReflection,
  submitValidation,
  getReflectionsByProject,
  getReflectionByEmployeeAndProject,
  getValidationsByEmployeeAndProject,
  getValidationByAdminAndEmployeeAndProject,
  getValidatedSkillsByEmployeeAndProject,
} from "../controllers/history.controller.js";

const router = Router();

// Employee submits their own reflection (employeeId is set server-side from the token)
router.post("/reflections", authMiddleware, requireRole("employee"), validate(employeeReflectionSchema), submitReflection);

// Admin submits their own validation (adminId is set server-side from the token)
router.post("/validations", authMiddleware, requireRole("admin"), validate(adminValidationSchema), submitValidation);

// Admin-only: every employee's reflections for a project
router.get("/reflections/project/:projectId", authMiddleware, requireRole("admin"), getReflectionsByProject);

// Employee (own) or any admin: a single reflection
router.get("/reflections/:employeeId/:projectId", authMiddleware, isSelfOrAdmin, getReflectionByEmployeeAndProject);

// Employee (own) or any admin: all admins' validations for that employee+project
router.get("/validations/:employeeId/:projectId", authMiddleware, isSelfOrAdmin, getValidationsByEmployeeAndProject);

// Admin-only: the calling admin's own validation (adminId comes from the token, not the URL)
router.get("/validations/mine/:employeeId/:projectId", authMiddleware, requireRole("admin"), getValidationByAdminAndEmployeeAndProject);

// Employee (own) or any admin: validated skill set
router.get("/skills/:employeeId/:projectId", authMiddleware, isSelfOrAdmin, getValidatedSkillsByEmployeeAndProject);

export default router;
