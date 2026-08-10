import type { ITopic, IComment } from "../types/discussions.types.js";
import { Topic, Comment } from "../models/Discussions.model.js";
import { userCanAccessProject } from "../utils/projectAccess.js";
import { createTopicSchema, createCommentSchema, editCommentSchema, editTopicSchema } from "../validators/discussions.validator.js";
import type { Request, Response } from "express";
import mongoose, { Types } from "mongoose";

// ---------- Topics ----------

export const createTopic = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id: projectId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!projectId || !Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Valid project id is required!" });
    }

    const projectIdObj = new Types.ObjectId(projectId);
    const hasAccess = await userCanAccessProject(req.user.id, projectIdObj, (req.user.role === "admin"));
    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    let validated;
    try {
      validated = await createTopicSchema.validate(
        {
          project: projectId,
          author: req.user.id,
          title: req.body.title,
          content: req.body.content,
        },
        { abortEarly: false }
      );
    } catch (validationErr: any) {
      return res.status(400).json({ message: "Validation failed", errors: validationErr.errors });
    }

    const topicData: Partial<ITopic> = {
      project: new Types.ObjectId(validated.project),
      author: new Types.ObjectId(validated.author),
      title: validated.title,
      content: validated.content,
      upvotes: [],
      isPinned: false,
    };

    const topic = await Topic.create(topicData);

    return res.status(201).json(topic);
  } catch (err) {
    console.error("Error creating topic:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editTopic = async (req: Request<{ topicId: string }>, res: Response) => {
  try {
    const { topicId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!topicId || !Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Valid topic id is required!" });
    }

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const hasAccess = await userCanAccessProject(req.user.id, topic.project,(req.user.role === "admin"));
    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (topic.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own topic" });
    }

    let validated;
    try {
      validated = await editTopicSchema.validate(req.body, { abortEarly: false });
    } catch (validationErr: any) {
      return res.status(400).json({ message: "Validation failed", errors: validationErr.errors });
    }

    if (validated.title !== undefined) topic.title = validated.title;
    if (validated.content !== undefined) topic.content = validated.content;

    await topic.save();

    return res.status(200).json(topic);
  } catch (err) {
    console.error("Error editing topic:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteTopic = async (req: Request<{ topicId: string }>, res: Response) => {
  const session = await mongoose.startSession();
  try {
    const { topicId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!topicId || !Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Valid topic id is required!" });
    }

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const hasAccess = await userCanAccessProject(req.user.id, topic.project, (req.user.role === "admin"));
    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (topic.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You don't have permission to delete this topic" });
    }

    session.startTransaction();

    await Comment.deleteMany({ topic: topic._id }).session(session);
    await Topic.deleteOne({ _id: topic._id }).session(session);

    await session.commitTransaction();

    return res.status(200).json({ message: "Topic and all its comments deleted" });
  } catch (err) {
    if (session.inTransaction()) await session.abortTransaction();
    console.error("Error deleting topic:", err);
    return res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};

// ---------- Comments (top-level comment on a topic, or reply to a comment — same handler) ----------

export const createComment = async (req: Request<{ topicId: string }>, res: Response) => {
  try {
    const { topicId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!topicId || !Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Valid topic id is required!" });
    }

    const topic = await Topic.findById(topicId);
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    const hasAccess = await userCanAccessProject(req.user.id, topic.project, (req.user.role === "admin"));
    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    let validated;
    try {
      validated = await createCommentSchema.validate(req.body, { abortEarly: false });
    } catch (validationErr: any) {
      return res.status(400).json({ message: "Validation failed", errors: validationErr.errors });
    }

    let parentCommentId: Types.ObjectId | undefined;
    let replyingToAuthor: Types.ObjectId | undefined;

    if (validated.parentComment) {
      const parentComment = await Comment.findById(validated.parentComment);
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
      if (parentComment.topic.toString() !== topic._id.toString()) {
        return res.status(400).json({ message: "Parent comment does not belong to this topic" });
      }

      // flatten: always attach to the top-level comment, remember who's actually being addressed
      parentCommentId = (parentComment.parentComment as Types.ObjectId) ?? (parentComment._id as Types.ObjectId);
      replyingToAuthor = parentComment.author as Types.ObjectId;
    }

    const commentData: Partial<IComment> = {
      topic: topic._id as Types.ObjectId,
      ...(parentCommentId && { parentComment: parentCommentId }),
      ...(replyingToAuthor && { replyingToAuthor }),
      author: new Types.ObjectId(req.user.id),
      content: validated.content,
      upvotes: [],
    };

    const comment = await Comment.create(commentData);
    const populatedComment = await comment.populate([
      { path: "author", select: "name avatar" },
      { path: "replyingToAuthor", select: "name" }
    ]);

    return res.status(201).json(populatedComment);
  } catch (err) {
    console.error("Error creating comment:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editComment = async (req: Request<{ commentId: string }>, res: Response) => {
  try {
    const { commentId } = req.params;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!commentId || !Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Valid comment id is required!" });
    }

    const comment = await Comment.findById(commentId).populate<{ topic: ITopic }>("topic");
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const hasAccess = await userCanAccessProject(req.user.id, comment.topic.project, (req.user.role === "admin"));
    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own comment" });
    }

    let validated;
    try {
      validated = await editCommentSchema.validate(req.body, { abortEarly: false });
    } catch (validationErr: any) {
      return res.status(400).json({ message: "Validation failed", errors: validationErr.errors });
    }

    comment.content = validated.content;
    await comment.save();

    return res.status(200).json(comment);
  } catch (err) {
    console.error("Error editing comment:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteComment = async (req: Request<{ commentId: string }>, res: Response) => {
  try {
    const { commentId } = req.params;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!commentId || !Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Valid comment id is required!" });
    }

    const comment = await Comment.findById(commentId).populate<{ topic: ITopic }>("topic");
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const hasAccess = await userCanAccessProject(req.user.id, comment.topic.project, req.user.role === "admin");
    if (!hasAccess) return res.status(403).json({ message: "Forbidden" });

    if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "You don't have permission to delete this comment" });
    }

    // one call, one collection — no session needed, a reply never has its own children
    await Comment.deleteMany({ $or: [{ _id: comment._id }, { parentComment: comment._id }] });

    return res.status(200).json({ message: "Comment and its replies deleted" });
  } catch (err) {
    console.error("Error deleting comment:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- Reads ----------

export const listTopics = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id: projectId } = req.params;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!projectId || !Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: "Valid project id is required!" });
    }

    const projectIdObj = new Types.ObjectId(projectId);
    const hasAccess = await userCanAccessProject(req.user.id, projectIdObj, req.user.role === "admin");
    if (!hasAccess) return res.status(403).json({ message: "Forbidden" });

    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 20, 1), 100);

    const topics = await Topic.find({ project: projectIdObj })
      .sort({ isPinned: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const topicIds = topics.map(t => t._id);
    const commentCounts = await Comment.aggregate([
      { $match: { topic: { $in: topicIds } } },
      { $group: { _id: "$topic", count: { $sum: 1 } } }
    ]);
    
    const countMap = new Map(commentCounts.map(c => [c._id.toString(), c.count]));
    const topicsWithCount = topics.map(t => ({
      ...t,
      replyCount: countMap.get(t._id.toString()) || 0
    }));

    return res.status(200).json({ topics: topicsWithCount, page, limit });
  } catch (err) {
    console.error("Error listing topics:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTopic = async (req: Request<{ topicId: string }>, res: Response) => {
  try {
    const { topicId } = req.params;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!topicId || !Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Valid topic id is required!" });
    }

    const topic = await Topic.findById(topicId).lean();
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const hasAccess = await userCanAccessProject(req.user.id, topic.project, req.user.role === "admin");
    if (!hasAccess) return res.status(403).json({ message: "Forbidden" });

    const comments = await Comment.find({ topic: topic._id })
      .sort({ createdAt: 1 })
      .populate("author", "name avatar")
      .populate("replyingToAuthor", "name")
      .lean();

    const topLevel = comments.filter((c) => !c.parentComment);
    const repliesByParent = new Map<string, typeof comments>();

    for (const c of comments) {
      if (c.parentComment) {
        const key = c.parentComment.toString();
        if (!repliesByParent.has(key)) repliesByParent.set(key, []);
        repliesByParent.get(key)!.push(c);
      }
    }

    const threaded = topLevel.map((parent) => ({
      ...parent,
      replies: repliesByParent.get((parent._id as Types.ObjectId).toString()) ?? [],
    }));

    return res.status(200).json({ topic, comments: threaded });
  } catch (err) {
    console.error("Error fetching topic:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- Upvotes ----------

export const toggleTopicUpvote = async (req: Request<{ topicId: string }>, res: Response) => {
  try {
    const { topicId } = req.params;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!topicId || !Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Valid topic id is required!" });
    }

    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const hasAccess = await userCanAccessProject(req.user.id, topic.project, req.user.role === "admin");
    if (!hasAccess) return res.status(403).json({ message: "Forbidden" });

    const userId = new Types.ObjectId(req.user.id);
    const alreadyUpvoted = topic.upvotes.some((u) => u.toString() === userId.toString());

    const updated = await Topic.findByIdAndUpdate(
      topicId,
      alreadyUpvoted ? { $pull: { upvotes: userId } } : { $addToSet: { upvotes: userId } },
      { new: true }
    );

    return res.status(200).json({ upvotes: updated!.upvotes.length, upvoted: !alreadyUpvoted });
  } catch (err) {
    console.error("Error toggling topic upvote:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleCommentUpvote = async (req: Request<{ commentId: string }>, res: Response) => {
  try {
    const { commentId } = req.params;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!commentId || !Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ message: "Valid comment id is required!" });
    }

    const comment = await Comment.findById(commentId).populate<{ topic: ITopic }>("topic");
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const hasAccess = await userCanAccessProject(req.user.id, comment.topic.project, req.user.role === "admin");
    if (!hasAccess) return res.status(403).json({ message: "Forbidden" });

    const userId = new Types.ObjectId(req.user.id);
    const alreadyUpvoted = comment.upvotes.some((u) => u.toString() === userId.toString());

    const updated = await Comment.findByIdAndUpdate(
      commentId,
      alreadyUpvoted ? { $pull: { upvotes: userId } } : { $addToSet: { upvotes: userId } },
      { new: true }
    );

    return res.status(200).json({ upvotes: updated!.upvotes.length, upvoted: !alreadyUpvoted });
  } catch (err) {
    console.error("Error toggling comment upvote:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ---------- Pin (admin only — role enforced by requireRole at the route level) ----------
export const toggleTopicPin = async (req: Request<{ topicId: string }>, res: Response) => {
  try {
    const { topicId } = req.params;

    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!topicId || !Types.ObjectId.isValid(topicId)) {
      return res.status(400).json({ message: "Valid topic id is required!" });
    }

    const topic = await Topic.findById(topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const hasAccess = await userCanAccessProject(req.user.id, topic.project, true);
    if (!hasAccess) return res.status(403).json({ message: "Forbidden" });

    topic.isPinned = !topic.isPinned;
    await topic.save();

    return res.status(200).json(topic);
  } catch (err) {
    console.error("Error toggling topic pin:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};