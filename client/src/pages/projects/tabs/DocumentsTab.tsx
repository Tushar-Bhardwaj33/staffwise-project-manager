import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../../context/useAuth";
import {
  listDocuments,
  uploadDocument,
  deleteDocument,
  downloadDocument,
} from "../../../services/documents.service";
import type { IProjectDocument } from "../../../types/document.type";
import { Spinner } from "../../../components/ui/Spinner";
import { EmptyState } from "../../../components/ui/EmptyState";
import { ConfirmModal } from "../../../components/ui/ConfirmModal";
import { toast } from "../../../utils/toast";
interface Props { projectId: string }

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DocumentsTab({ projectId }: Props) {
  const { user } = useAuth();
  const [docs, setDocs] = useState<IProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [titleInput, setTitleInput] = useState("");
  const [deleteDocId, setDeleteDocId] = useState<string | null>(null);

  const fetchDocs = () =>
    listDocuments(projectId)
      .then(setDocs)
      .catch(console.error)
      .finally(() => setLoading(false));

  useEffect(() => { fetchDocs(); }, [projectId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await uploadDocument(projectId, file, titleInput || file.name);
      setTitleInput("");
      if (fileRef.current) fileRef.current.value = "";
      await fetchDocs();
    } catch {
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDocId) return;
    try {
      await deleteDocument(projectId, deleteDocId);
      setDocs((d) => d.filter((doc) => doc._id !== deleteDocId));
      toast.success("Document Deleted", "Document has been deleted successfully");
    } catch {
      toast.error("Error", "Failed to delete document");
    } finally {
      setDeleteDocId(null);
    }
  };

  const handleDownload = async (docId: string, filename: string) => {
    try {
      await downloadDocument(projectId, docId, filename);
    } catch {
      alert("Download failed.");
    }
  };

  return (
    <div className="space-y-5">
      {/* Upload */}
      {user?.role === "admin" && (
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Upload document</h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Document title (optional)"
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
            <label className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
              uploading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}>
              {uploading ? <><Spinner size="sm" /> Uploading…</> : "Choose file"}
              <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : docs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white border border-gray-200 rounded-xl">
          <EmptyState
            title="No documents yet"
            description="Upload the first document for this project."
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-gray-50 p-4 border border-gray-200 rounded-xl">
            <h3 className="text-sm font-medium text-gray-700">Project Documents</h3>
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:border-blue-600 focus:outline-none w-64"
            />
          </div>

          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-200">
            {docs.filter(d => 
              d.filename.toLowerCase().includes(searchQuery.toLowerCase()) || 
              d.title.toLowerCase().includes(searchQuery.toLowerCase())
            ).length === 0 ? (
              <div className="py-10 text-center text-sm text-gray-500">No documents match your search.</div>
            ) : (
              docs.filter(d => 
                d.filename.toLowerCase().includes(searchQuery.toLowerCase()) || 
                d.title.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((doc) => (
                <div key={doc._id} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-gray-500 text-xs font-bold uppercase shrink-0">
                    {doc.filename.split(".").pop()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                    <p className="text-xs text-gray-500">{doc.filename} · {formatBytes(doc.size)}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleDownload(doc._id, doc.filename)}
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      Download
                    </button>
                    {(user?.role === "admin" || doc.uploadedBy === user?._id) && (
                      <button
                        onClick={() => setDeleteDocId(doc._id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteDocId}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDocId(null)}
      />
    </div>
  );
}