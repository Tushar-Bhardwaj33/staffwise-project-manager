import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  topic: Types.ObjectId;
  parentComment?: Types.ObjectId;
  author: Types.ObjectId;
  replyingToAuthor?: Types.ObjectId
  content: string;
  upvotes: Types.ObjectId[];
}

export interface ITopic extends Document {
  project: Types.ObjectId;
  author: Types.ObjectId;
  title: string;
  content: string;
  upvotes: Types.ObjectId[];
  isPinned: boolean;
  createdAt: Date;
}
