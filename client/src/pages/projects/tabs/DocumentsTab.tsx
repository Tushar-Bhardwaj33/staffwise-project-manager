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
  const fileRef = useRef<HTMLInputElement>(null);
  const [titleInput, setTitleInput] = useState("");

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

  const handleDelete = async (docId: string) => {
    if (!confirm("Delete this document?")) return;
    await deleteDocument(projectId, docId);
    setDocs((d) => d.filter((doc) => doc._id !== docId));
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
      <div className="bg-white border border-[#e3e8ee] rounded-xl p-5">
        <h2 className="text-sm font-semibold text-[#0f1419] mb-3">Upload document</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            placeholder="Document title (optional)"
            className="flex-1 rounded-lg border border-[#e3e8ee] px-3 py-2 text-sm focus:border-[#20beff] focus:outline-none"
          />
          <label className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
            uploading
              ? "bg-[#e3e8ee] text-[#9ca3af] cursor-not-allowed"
              : "bg-[#20beff] text-white hover:bg-[#0f9fdb]"
          }`}>
            {uploading ? <><Spinner size="sm" /> Uploading…</> : "Choose file"}
            <input ref={fileRef} type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10"><Spinner /></div>
      ) : docs.length === 0 ? (
        <EmptyState title="No documents yet" description="Upload the first document for this project." />
      ) : (
        <div className="bg-white border border-[#e3e8ee] rounded-xl divide-y divide-[#e3e8ee]">
          {docs.map((doc) => (
            <div key={doc._id} className="flex items-center gap-3 px-5 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f0f4f8] text-[#5b6b79] text-xs font-bold uppercase shrink-0">
                {doc.filename.split(".").pop()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0f1419] truncate">{doc.title}</p>
                <p className="text-xs text-[#9ca3af]">{doc.filename} · {formatBytes(doc.size)}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleDownload(doc._id, doc.filename)}
                  className="text-xs font-medium text-[#20beff] hover:underline"
                >
                  Download
                </button>
                {(user?.role === "admin" || doc.uploadedBy === user?._id) && (
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="text-xs font-medium text-red-400 hover:text-red-600"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}