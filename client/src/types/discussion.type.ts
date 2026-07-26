export interface IPopulatedAuthor {
  _id: string;
  name: string;
}

export interface ITopic {
  _id: string;
  project: string;
  author: string;
  title: string;
  content: string;
  upvotes: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IComment {
  _id: string;
  topic: string;
  parentComment?: string;
  author: IPopulatedAuthor;
  replyingToAuthor?: IPopulatedAuthor;
  content: string;
  upvotes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IThreadedComment extends IComment {
  replies: IComment[];
}