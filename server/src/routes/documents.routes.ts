import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js"; // adjust to your existing JWT middleware
import { upload } from "../middlewares/upload.middleware.js";
import {
  uploadDocument,
  listDocuments,
  downloadDocument,
  deleteDocument,
} from "../controllers/documents.controller.js";
import { requireRole } from "../middlewares/rbac.middleware.js";

const router = Router({ mergeParams: true });

router.post("/", authMiddleware,requireRole("admin"), upload.single("file"), uploadDocument);
router.get("/", authMiddleware, listDocuments);
router.get("/:docId/download", authMiddleware, downloadDocument);
router.delete("/:docId", authMiddleware, requireRole("admin"), deleteDocument);

export default router;
