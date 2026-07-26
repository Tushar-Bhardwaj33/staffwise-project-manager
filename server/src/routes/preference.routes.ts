import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/rbac.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { submitPreferenceSchema } from "../validators/preference.validator.js";
import {
  submitPreference,
  viewPreferences,
} from "../controllers/preference.controller.js";

const router = Router();

router.post("/preferences", authMiddleware, requireRole("admin"), validate(submitPreferenceSchema), submitPreference);
router.get("/preferences/:projectId", authMiddleware, viewPreferences);

export default router;