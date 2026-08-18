import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { register, login, logout, getMe } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, getMe);

export default router;

// POST /api/auth/register "`High` Create employee account (validates email + employeeId uniqueness)"
// POST /api/auth/login "`High` Authenticate, issue JWT"
// POST /api/auth/logout "`High` Clear session"
// GET /api/auth/me "`High` Current user"
