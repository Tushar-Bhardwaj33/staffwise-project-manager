import { Schema, model, Document, Types } from "mongoose";
import type { IComment } from "../types/discussions.types.js";
import type { ITopic } from "../types/discussions.types.js";

const commentSchema = new Schema<IComment>(
  {
    topic: { type: Schema.Types.ObjectId, ref: "Topic", required: true }, // denormalized — lets you fetch every comment in a thread with one query, regardless of depth
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment" }, // undefined = direct reply to the topic; set = reply to another comment
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    replyingToAuthor: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const topicSchema = new Schema<ITopic>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Topic = model<ITopic>("Topic", topicSchema);
export const Comment = model<IComment>("Comment", commentSchema);

// Comment–-M
// {
// _id:ObjectId,
// project:ObjectId, //refProject
// author:ObjectId, //refUser
// title?:string, //requiredfortop-leveltopics;omittedforreplies
// content:string,
// parentComment?:ObjectId,//refComment–-onelevelofreplyonly
// upvotes:ObjectId[], //refUser
// isPinned:boolean, //defaultfalse;onepinnedcommentperproject
// createdAt:Date
// }