import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// Expected shape: GET /api/repositories -> Repo[]
// Repo = { id: string; name: string; url: string; status: "indexing"|"ready"|"failed"; fileCount: number; chunkCount: number; lastIndexed: string; progress?: number }
type Repo = {
  id: string;
  name: string;
  url: string;
  status: "indexing" | "ready" | "failed";
  fileCount: number;
  chunkCount: number;
  lastIndexed: string;
  progress?: number;
};

const MOCK: Repo[] = [
  { id: "1", name: "acme/api-server", url: "https://github.com/acme/api-server", status: "ready", fileCount: 428, chunkCount: 3921, lastIndexed: "2 hours ago" },
  { id: "2", name: "acme/web-client", url: "https://github.com/acme/web-client", status: "ready", fileCount: 612, chunkCount: 5104, lastIndexed: "5 hours ago" },
  { id: "3", name: "acme/ml-pipeline", url: "https://github.com/acme/ml-pipeline", status: "indexing", fileCount: 189, chunkCount: 1240, lastIndexed: "indexing...", progress: 62 },
  { id: "4", name: "acme/infra-terraform", url: "https://github.com/acme/infra-terraform", status: "failed", fileCount: 0, chunkCount: 0, lastIndexed: "yesterday" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Repositories — CodeIntel" },
      { name: "description", content: "Manage and index your connected code repositories for semantic search." },
    ],
  }),
  component: RepositoriesPage,
});

function StatusBadge({ status }: { status: Repo["status"] }) {
  const map = {
    ready: { label: "Ready", color: "var(--brand-teal)" },
    indexing: { label: "Indexing", color: "var(--brand-amber)" },
    failed: { label: "Failed", color: "var(--brand-red)" },
  } as const;
  const { label, color } = map[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-xs" style={{ color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function RepositoriesPage() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    const load = () => {
      fetch("/api/repositories")
        .then((r) => r.json())
        .then(setRepos)
        .catch((err) => {
          console.error("Failed to load repositories:", err);
        });
    };

    load(); // initial fetch
    const interval = setInterval(load, 3000); // poll every 3s
    return () => clearInterval(interval);
  }, []);

  const addRepo = async () => {
    if (!url.trim()) return;
    try {
      const res = await fetch("/api/repositories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const newRepo = await res.json();
      setRepos((r) => [{ ...newRepo, fileCount: 0, chunkCount: 0, lastIndexed: "just now" }, ...(r ?? [])]);
      setUrl("");
      setModalOpen(false);
    } catch (err) {
      console.error("Failed to add repository:", err);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Repositories</h1>
          <p className="mt-1 text-sm text-muted-foreground">Index your GitHub repositories to enable semantic search and AI reviews.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{ backgroundColor: "var(--brand-purple)", color: "#0a0a09" }}
        >
          + Connect repository
        </button>
      </div>

      {repos === null ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="h-40 animate-pulse rounded-xl bg-card" />)}
        </div>
      ) : repos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No repositories indexed yet</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 rounded-lg px-4 py-2 text-sm font-medium"
            style={{ backgroundColor: "var(--brand-purple)", color: "#0a0a09" }}
          >
            Connect your first repository
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {repos.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-mono text-sm font-medium">{r.name}</h3>
                  <a href={r.url} target="_blank" rel="noreferrer" className="truncate text-xs text-muted-foreground hover:text-foreground">{r.url}</a>
                </div>
                <StatusBadge status={r.status} />
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                <div><div className="text-lg font-semibold text-foreground">{r.fileCount.toLocaleString()}</div>files</div>
                <div><div className="text-lg font-semibold text-foreground">{r.chunkCount.toLocaleString()}</div>chunks</div>
              </div>
              {r.status === "indexing" && (
                <div className="mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full transition-all" style={{ width: `${r.progress ?? 0}%`, backgroundColor: "var(--brand-amber)" }} />
                  </div>
                </div>
              )}
              <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">Last indexed: {r.lastIndexed}</div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setModalOpen(false)}>
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold">Connect repository</h2>
            <p className="mt-1 text-sm text-muted-foreground">Paste a GitHub repository URL to start indexing.</p>
            <input
              type="url"
              autoFocus
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://github.com/owner/repo"
              className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-primary"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-accent">Cancel</button>
              <button onClick={addRepo} className="rounded-lg px-4 py-2 text-sm font-medium" style={{ backgroundColor: "var(--brand-purple)", color: "#0a0a09" }}>
                Index repository
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
