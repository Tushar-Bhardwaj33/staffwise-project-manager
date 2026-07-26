import api from "./api";
import type { ITopic, IComment, IThreadedComment } from "../types/discussion.type.js";

interface ITopicsListResponse {
  topics: ITopic[];
  page: number;
  limit: number;
}

interface ITopicDetailResponse {
  topic: ITopic;
  comments: IThreadedComment[];
}

interface IUpvoteResponse {
  upvotes: number;
  upvoted: boolean;
}

interface IMessageResponse {
  message: string;
}

// ---------- Topics ----------

export const listTopics = async (projectId: string, page = 1, limit = 20) => {
  const response = await api.get<ITopicsListResponse>(`projects/${projectId}/discussions/topics`, {
    params: { page, limit },
  });
  return response.data;
}

export const getTopic = async (projectId: string, topicId: string) => {
  const response = await api.get<ITopicDetailResponse>(`projects/${projectId}/discussions/topics/${topicId}`);
  return response.data;
}

export const createTopic = async (projectId: string, topicData: { title: string; content: string }) => {
  // backend returns the topic document bare — not wrapped in { topic }
  const response = await api.post<ITopic>(`projects/${projectId}/discussions/topics`, topicData);
  return response.data;
}

export const editTopic = async (
  projectId: string,
  topicId: string,
  topicData: Partial<{ title: string; content: string }>
) => {
  const response = await api.patch<ITopic>(`projects/${projectId}/discussions/topics/${topicId}`, topicData);
  return response.data;
}

export const deleteTopic = async (projectId: string, topicId: string) => {
  const response = await api.delete<IMessageResponse>(`projects/${projectId}/discussions/topics/${topicId}`);
  return response.data;
}

export const toggleTopicUpvote = async (projectId: string, topicId: string) => {
  const response = await api.patch<IUpvoteResponse>(`projects/${projectId}/discussions/topics/${topicId}/upvote`);
  return response.data;
}

// admin only — route also enforces this server-side via requireRole("admin")
export const toggleTopicPin = async (projectId: string, topicId: string) => {
  const response = await api.patch<ITopic>(`projects/${projectId}/discussions/topics/${topicId}/pin`);
  return response.data;
}

// ---------- Comments ----------
// omit parentComment for a top-level comment; pass any comment's _id to reply —
// the backend flattens it to a reply-on-the-top-level-comment either way

export const createComment = async (
  projectId: string,
  topicId: string,
  commentData: { content: string; parentComment?: string }
) => {
  const response = await api.post<IComment>(
    `projects/${projectId}/discussions/topics/${topicId}/comments`,
    commentData
  );
  return response.data;
}

export const editComment = async (projectId: string, commentId: string, content: string) => {
  const response = await api.patch<IComment>(`projects/${projectId}/discussions/comments/${commentId}`, { content });
  return response.data;
}

export const deleteComment = async (projectId: string, commentId: string) => {
  const response = await api.delete<IMessageResponse>(`projects/${projectId}/discussions/comments/${commentId}`);
  return response.data;
}

export const toggleCommentUpvote = async (projectId: string, commentId: string) => {
  const response = await api.patch<IUpvoteResponse>(`projects/${projectId}/discussions/comments/${commentId}/upvote`);
  return response.data;
}