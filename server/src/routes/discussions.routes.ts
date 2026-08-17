import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createTopic,
  editTopic,
  deleteTopic,
  createComment,
  editComment,
  deleteComment,
  listTopics,
  getTopic,
  toggleCommentUpvote,
  toggleTopicPin,
  toggleTopicUpvote
} from "../controllers/discussions.controller.js";
import { requireRole } from "../middlewares/rbac.middleware.js";

const router = Router({ mergeParams: true });

router.post("/topics", authMiddleware, createTopic);
router.patch("/topics/:topicId", authMiddleware, editTopic);
router.delete("/topics/:topicId", authMiddleware, deleteTopic);

router.post("/topics/:topicId/comments", authMiddleware, createComment);
router.patch("/comments/:commentId", authMiddleware, editComment);
router.delete("/comments/:commentId", authMiddleware, deleteComment);

router.get("/topics", authMiddleware, listTopics);
router.get("/topics/:topicId", authMiddleware, getTopic);
router.patch("/topics/:topicId/upvote", authMiddleware, toggleTopicUpvote);
router.patch("/comments/:commentId/upvote", authMiddleware, toggleCommentUpvote);
router.patch("/topics/:topicId/pin", authMiddleware, requireRole("admin"), toggleTopicPin);

export default router;
