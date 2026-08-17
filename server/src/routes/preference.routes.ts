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

router.post("/preferences", authMiddleware, validate(submitPreferenceSchema), submitPreference);
router.get("/preferences/:projectId", authMiddleware, requireRole("admin"), viewPreferences);

export default router;
