import { Schema, model, Document, Types } from "mongoose";

export interface IComment extends Document {
  project: Types.ObjectId;
  author: Types.ObjectId;
  title?: string;
  content: string;
  parentComment?: Types.ObjectId;
  upvotes: Types.ObjectId[];
  isPinned: boolean;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String }, // required only for top-level topics — enforce in controller
    content: { type: String, required: true },
    parentComment: { type: Schema.Types.ObjectId, ref: "Comment" },
    upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isPinned: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

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