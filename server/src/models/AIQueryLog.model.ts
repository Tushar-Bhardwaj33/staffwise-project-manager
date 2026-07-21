import { Schema, model, Document, Types } from "mongoose";

export interface IAIQueryLog extends Document {
  user: Types.ObjectId;
  query: string;
  response: string;
  context?: {
    projectId?: Types.ObjectId;
  };
  createdAt: Date;
}

const aiQueryLogSchema = new Schema<IAIQueryLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    query: { type: String, required: true },
    response: { type: String, required: true },
    context: {
      projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const AIQueryLog = model<IAIQueryLog>("AIQueryLog", aiQueryLogSchema);

//AIQueryLog–-M
// {
// _id:ObjectId,
// user:ObjectId, //refUser
// query:string,
// response:string,
// context?:{projectId?:ObjectId},
// createdAt:Date
// }