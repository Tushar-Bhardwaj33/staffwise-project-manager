export interface IComment {
  project: string;
  author: string;
  title?: string;
  content: string;
  parentComment?: string;
  upvotes: string[];
  isPinned: boolean;
  createdAt: Date;
}