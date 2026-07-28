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
} from "../../../services/discussions.service";
import type { ITopic, IComment, IThreadedComment } from "../../../types/discussion.type";
import { Spinner } from "../../../components/ui/Spinner";
import { EmptyState } from "../../../components/ui/EmptyState";

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

  const handleDeleteTopic = async (topicId: string) => {
    if (!confirm("Delete this topic?")) return;
    await deleteTopic(projectId, topicId);
    setTopics((prev) => prev.filter((t) => t._id !== topicId));
    if (expandedTopic === topicId) setExpandedTopic(null);
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

  const handleDeleteComment = async (topicId: string, commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    await deleteComment(projectId, commentId);
    setTopicComments((prev) => ({
      ...prev,
      [topicId]: (prev[topicId] ?? []).filter((c) => c._id !== commentId),
    }));
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
                  onPin={() => handlePin(t._id)} onDelete={() => handleDeleteTopic(t._id)}
                  replyContent={replyContent[t._id] ?? ""}
                  onReplyChange={(v) => setReplyContent((p) => ({ ...p, [t._id]: v }))}
                  onReplySubmit={() => handleReply(t._id)} submittingReply={submittingReply === t._id}
                  onCommentUpvote={(cid) => handleCommentUpvote(t._id, cid)}
                  onCommentDelete={(cid) => handleDeleteComment(t._id, cid)}
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
              onPin={() => handlePin(t._id)} onDelete={() => handleDeleteTopic(t._id)}
              replyContent={replyContent[t._id] ?? ""}
              onReplyChange={(v) => setReplyContent((p) => ({ ...p, [t._id]: v }))}
              onReplySubmit={() => handleReply(t._id)} submittingReply={submittingReply === t._id}
              onCommentUpvote={(cid) => handleCommentUpvote(t._id, cid)}
              onCommentDelete={(cid) => handleDeleteComment(t._id, cid)}
            />
          ))}
        </>
      )}
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
  replyContent: string;
  onReplyChange: (v: string) => void;
  onReplySubmit: () => void;
  submittingReply: boolean;
  onCommentUpvote: (id: string) => void;
  onCommentDelete: (id: string) => void;
}

function TopicCard({
  topic, user, expanded, comments,
  onExpand, onUpvote, onPin, onDelete,
  replyContent, onReplyChange, onReplySubmit, submittingReply,
  onCommentUpvote, onCommentDelete,
}: TopicCardProps) {
  const upvoted = user ? topic.upvotes.includes(user._id) : false;

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
              {user?.role === "admin" && (
                <>
                  <button onClick={onPin} className="hover:text-amber-500">
                    {topic.isPinned ? "Unpin" : "Pin"}
                  </button>
                  <button onClick={onDelete} className="hover:text-red-500 ml-auto">Delete</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 space-y-3">
          {comments.map((c) => (
            <CommentRow key={c._id} comment={c} user={user}
              onUpvote={() => onCommentUpvote(c._id)}
              onDelete={() => onCommentDelete(c._id)}
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

function CommentRow({ comment, user, onUpvote, onDelete }: {
  comment: IComment;
  user: { _id: string; role: string } | null;
  onUpvote: () => void;
  onDelete: () => void;
}) {
  const upvoted = user ? comment.upvotes.includes(user._id) : false;
  const authorName = typeof comment.author === "object" ? (comment.author as { name: string }).name : "User";

  return (
    <div className="flex gap-2">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-500">
        {authorName.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-900">{authorName}</span>
          <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{comment.content}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
          <button onClick={onUpvote} className={`flex items-center gap-1 ${upvoted ? "text-blue-600" : "hover:text-blue-600"}`}>
            ▲ {comment.upvotes.length}
          </button>
          {(user?.role === "admin" || (typeof comment.author === "object" && (comment.author as { _id: string })._id === user?._id)) && (
            <button onClick={onDelete} className="hover:text-red-500">Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}