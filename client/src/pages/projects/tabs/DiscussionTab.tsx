import { useEffect, useState } from "react";
import { useAuth } from "../../../context/useAuth";
import {
  listTopics,
  createTopic,
  deleteTopic,
  toggleTopicUpvote,
  toggleTopicPin,
  getTopic,
  createComment,
  toggleCommentUpvote,
  deleteComment,
  editTopic,
  editComment,
} from "../../../services/discussions.service";
import type { ITopic, IComment, IThreadedComment } from "../../../types/discussion.type";
import { Spinner } from "../../../components/ui/Spinner";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { toast } from "react-toastify";

interface Props { projectId: string }

export default function DiscussionTab({ projectId }: Props) {
  const { user } = useAuth();
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [topicComments, setTopicComments] = useState<Record<string, IThreadedComment[]>>({});
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [submittingReply, setSubmittingReply] = useState<string | null>(null);
  const [deleteTopicId, setDeleteTopicId] = useState<string | null>(null);
  const [deleteCommentData, setDeleteCommentData] = useState<{ topicId: string; commentId: string } | null>(null);

  const fetchTopics = () =>
    listTopics(projectId)
      .then((r) => setTopics(r.topics))
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { fetchTopics(); }, [projectId]);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setCreating(true);
    try {
      await createTopic(projectId, { title: newTitle.trim(), content: newContent.trim() });
      setNewTitle("");
      setNewContent("");
      setShowForm(false);
      await fetchTopics();
    } catch {
      alert("Failed to create topic.");
    } finally {
      setCreating(false);
    }
  };

  const handleExpand = async (topicId: string) => {
    if (expandedTopic === topicId) { setExpandedTopic(null); return; }
    setExpandedTopic(topicId);
    if (!topicComments[topicId]) {
      const { comments } = await getTopic(projectId, topicId);
      setTopicComments((prev) => ({ ...prev, [topicId]: comments }));
    }
  };

  const handleTopicUpvote = async (topicId: string) => {
    await toggleTopicUpvote(projectId, topicId);
    setTopics((prev) =>
      prev.map((t) => {
        if (t._id !== topicId) return t;
        const already = t.upvotes.includes(user!._id);
        return { ...t, upvotes: already ? t.upvotes.filter((u) => u !== user!._id) : [...t.upvotes, user!._id] };
      })
    );
  };

  const handlePin = async (topicId: string) => {
    await toggleTopicPin(projectId, topicId);
    await fetchTopics();
  };

  const handleDeleteTopic = async () => {
    if (!deleteTopicId) return;
    const topicId = deleteTopicId;
    try {
      await deleteTopic(projectId, topicId);
      setTopics((prev) => prev.filter((t) => t._id !== topicId));
      if (expandedTopic === topicId) setExpandedTopic(null);
      toast.success("Topic deleted");
    } catch {
      toast.error("Failed to delete topic");
    } finally {
      setDeleteTopicId(null);
    }
  };

  const handleEditTopic = async (topicId: string, title: string, content: string) => {
    try {
      await editTopic(projectId, topicId, { title, content });
      setTopics((prev) =>
        prev.map((t) => (t._id === topicId ? { ...t, title, content } : t))
      );
      toast.success("Topic updated");
    } catch {
      toast.error("Failed to update topic");
    }
  };

  const handleReply = async (topicId: string) => {
    const content = replyContent[topicId]?.trim();
    if (!content) return;
    setSubmittingReply(topicId);
    try {
      const comment = await createComment(projectId, topicId, { content });
      setTopicComments((prev) => ({
        ...prev,
        [topicId]: [...(prev[topicId] ?? []), { ...comment, replies: [] }],
      }));
      setReplyContent((prev) => ({ ...prev, [topicId]: "" }));
    } catch {
      alert("Failed to post reply.");
    } finally {
      setSubmittingReply(null);
    }
  };

  const handleCommentUpvote = async (topicId: string, commentId: string) => {
    await toggleCommentUpvote(projectId, commentId);
    setTopicComments((prev) => ({
      ...prev,
      [topicId]: (prev[topicId] ?? []).map((c) => {
        if (c._id !== commentId) return c;
        const already = c.upvotes.includes(user!._id);
        return { ...c, upvotes: already ? c.upvotes.filter((u) => u !== user!._id) : [...c.upvotes, user!._id] };
      }),
    }));
  };

  const handleDeleteComment = async () => {
    if (!deleteCommentData) return;
    const { topicId, commentId } = deleteCommentData;
    try {
      await deleteComment(projectId, commentId);
      setTopicComments((prev) => ({
        ...prev,
        [topicId]: (prev[topicId] ?? []).filter((c) => c._id !== commentId),
      }));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setDeleteCommentData(null);
    }
  };

  const handleEditComment = async (topicId: string, commentId: string, content: string) => {
    try {
      await editComment(projectId, commentId, content);
      setTopicComments((prev) => ({
        ...prev,
        [topicId]: (prev[topicId] ?? []).map((c) =>
          c._id === commentId ? { ...c, content } : c
        ),
      }));
      toast.success("Comment updated");
    } catch {
      toast.error("Failed to update comment");
    }
  };

  const pinned = topics.filter((t) => t.isPinned);
  const filtered = topics
    .filter((t) => !t.isPinned && t.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-5">
      {/* Controls */}
      <div className="flex gap-2">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search topics…"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
        />
        <button
          onClick={() => setShowForm((v) => !v)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + New topic
        </button>
      </div>

      {/* New topic form */}
      {showForm && (
        <form onSubmit={handleCreateTopic} className="bg-white border border-blue-600 rounded-xl p-4 space-y-3">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Topic title"
            required
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="What would you like to discuss?"
            required
            rows={3}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none resize-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {creating ? "Posting…" : "Post topic"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-500">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : topics.length === 0 ? (
        <EmptyState title="No topics yet" description="Start a discussion by posting the first topic." />
      ) : (
        <>
          {pinned.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">📌 Pinned</p>
              {pinned.map((t) => (
                <TopicCard key={t._id} topic={t} projectId={projectId} user={user}
                  expanded={expandedTopic === t._id} comments={topicComments[t._id] ?? []}
                  onExpand={() => handleExpand(t._id)} onUpvote={() => handleTopicUpvote(t._id)}
                  onPin={() => handlePin(t._id)} onDelete={() => setDeleteTopicId(t._id)}
                  onEdit={(title, content) => handleEditTopic(t._id, title, content)}
                  replyContent={replyContent[t._id] ?? ""}
                  onReplyChange={(v) => setReplyContent((p) => ({ ...p, [t._id]: v }))}
                  onReplySubmit={() => handleReply(t._id)} submittingReply={submittingReply === t._id}
                  onCommentUpvote={(cid) => handleCommentUpvote(t._id, cid)}
                  onCommentDelete={(cid) => setDeleteCommentData({ topicId: t._id, commentId: cid })}
                  onCommentEdit={(cid, content) => handleEditComment(t._id, cid, content)}
                />
              ))}
            </div>
          )}
          {filtered.length === 0 && search && (
            <p className="text-sm text-gray-400 text-center py-6">No topics matching "{search}"</p>
          )}
          {filtered.map((t) => (
            <TopicCard key={t._id} topic={t} projectId={projectId} user={user}
              expanded={expandedTopic === t._id} comments={topicComments[t._id] ?? []}
              onExpand={() => handleExpand(t._id)} onUpvote={() => handleTopicUpvote(t._id)}
              onPin={() => handlePin(t._id)} onDelete={() => setDeleteTopicId(t._id)}
              onEdit={(title, content) => handleEditTopic(t._id, title, content)}
              replyContent={replyContent[t._id] ?? ""}
              onReplyChange={(v) => setReplyContent((p) => ({ ...p, [t._id]: v }))}
              onReplySubmit={() => handleReply(t._id)} submittingReply={submittingReply === t._id}
              onCommentUpvote={(cid) => handleCommentUpvote(t._id, cid)}
              onCommentDelete={(cid) => setDeleteCommentData({ topicId: t._id, commentId: cid })}
              onCommentEdit={(cid, content) => handleEditComment(t._id, cid, content)}
            />
          ))}
        </>
      )}

      <ConfirmModal
        isOpen={!!deleteTopicId}
        title="Delete Topic"
        message="Are you sure you want to delete this topic? All comments within it will also be deleted."
        confirmText="Delete"
        onConfirm={handleDeleteTopic}
        onCancel={() => setDeleteTopicId(null)}
      />
      <ConfirmModal
        isOpen={!!deleteCommentData}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        confirmText="Delete"
        onConfirm={handleDeleteComment}
        onCancel={() => setDeleteCommentData(null)}
      />
    </div>
  );
}

interface TopicCardProps {
  topic: ITopic;
  projectId: string;
  user: { _id: string; role: string } | null;
  expanded: boolean;
  comments: IThreadedComment[];
  onExpand: () => void;
  onUpvote: () => void;
  onPin: () => void;
  onDelete: () => void;
  onEdit: (title: string, content: string) => void;
  replyContent: string;
  onReplyChange: (v: string) => void;
  onReplySubmit: () => void;
  submittingReply: boolean;
  onCommentUpvote: (id: string) => void;
  onCommentDelete: (id: string) => void;
  onCommentEdit: (id: string, content: string) => void;
}

function TopicCard({
  topic, user, expanded, comments,
  onExpand, onUpvote, onPin, onDelete, onEdit,
  replyContent, onReplyChange, onReplySubmit, submittingReply,
  onCommentUpvote, onCommentDelete, onCommentEdit,
}: TopicCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(topic.title);
  const [editContent, setEditContent] = useState(topic.content);

  const upvoted = user ? topic.upvotes.includes(user._id) : false;
  const isAuthor = typeof topic.author === "object" && (topic.author as { _id: string })._id === user?._id;

  return (
    <div className={`bg-white border rounded-xl overflow-hidden transition-all ${topic.isPinned ? "border-amber-300" : "border-gray-200"}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={onUpvote}
            className={`flex flex-col items-center text-xs rounded-lg px-2 py-1.5 min-w-[40px] transition-colors ${
              upvoted ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400 hover:text-blue-600"
            }`}
          >
            ▲
            <span className="font-semibold">{topic.upvotes.length}</span>
          </button>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-2 w-full pr-4 pb-2">
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-lg border border-blue-300 px-3 py-1.5 text-sm font-semibold focus:border-blue-600 focus:outline-none"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-blue-300 px-3 py-1.5 text-sm text-gray-700 focus:border-blue-600 focus:outline-none resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onEdit(editTitle, editContent);
                      setIsEditing(false);
                    }}
                    className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditTitle(topic.title);
                      setEditContent(topic.content);
                      setIsEditing(false);
                    }}
                    className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <button onClick={onExpand} className="text-left w-full">
                  <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{topic.content}</p>
                </button>
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                  <span>{new Date(topic.createdAt).toLocaleDateString()}</span>
                  <button onClick={onExpand} className="hover:text-blue-600">
                    {comments.length} repl{comments.length !== 1 ? "ies" : "y"}
                  </button>
                  {isAuthor && (
                    <button onClick={() => setIsEditing(true)} className="hover:text-blue-500">Edit</button>
                  )}
                  {user?.role === "admin" && (
                    <button onClick={onPin} className="hover:text-amber-500">
                      {topic.isPinned ? "Unpin" : "Pin"}
                    </button>
                  )}
                  {(user?.role === "admin" || isAuthor) && (
                    <button onClick={onDelete} className="hover:text-red-500 ml-auto">Delete</button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 space-y-3">
          {comments.map((c) => (
            <CommentRow key={c._id} comment={c} user={user}
              onUpvote={() => onCommentUpvote(c._id)}
              onDelete={() => onCommentDelete(c._id)}
              onEdit={(content) => onCommentEdit(c._id, content)}
            />
          ))}
          <div className="flex gap-2 pt-1">
            <textarea
              value={replyContent}
              onChange={(e) => onReplyChange(e.target.value)}
              placeholder="Write a reply…"
              rows={2}
              className="flex-1 resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
            <button
              onClick={onReplySubmit}
              disabled={!replyContent.trim() || submittingReply}
              className="self-end rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40"
            >
              {submittingReply ? "…" : "Reply"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function CommentRow({ comment, user, onUpvote, onDelete, onEdit }: {
  comment: IComment;
  user: { _id: string; role: string } | null;
  onUpvote: () => void;
  onDelete: () => void;
  onEdit: (content: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const upvoted = user ? comment.upvotes.includes(user._id) : false;
  const authorName = typeof comment.author === "object" ? (comment.author as { name: string }).name : "User";
  const isAuthor = typeof comment.author === "object" && (comment.author as { _id: string })._id === user?._id;

  return (
    <div className="flex gap-2">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">
        {authorName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-900">{authorName}</span>
          <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        
        {isEditing ? (
          <div className="mt-1 space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={2}
              className="w-full text-sm rounded-lg border border-blue-300 px-2 py-1.5 focus:border-blue-600 focus:outline-none resize-none"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onEdit(editContent);
                  setIsEditing(false);
                }}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditContent(comment.content);
                  setIsEditing(false);
                }}
                className="text-xs border border-gray-300 text-gray-600 px-2 py-1 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mt-0.5">{comment.content}</p>
        )}
        
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <button onClick={onUpvote} className={`flex items-center gap-1 ${upvoted ? "text-blue-600" : "hover:text-blue-600"}`}>
            ▲ {comment.upvotes.length}
          </button>
          {!isEditing && isAuthor && (
            <button onClick={() => setIsEditing(true)} className="hover:text-blue-500">Edit</button>
          )}
          {!isEditing && (user?.role === "admin" || isAuthor) && (
            <button onClick={onDelete} className="hover:text-red-500">Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}