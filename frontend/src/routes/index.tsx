import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// GET /api/repositories -> Repo[]
// POST /api/repositories { url } -> Repo
type Repo = {
  id: string;
  name: string;
  url: string;
  status: "ready" | "indexing" | "failed";
  fileCount: number;
  chunkCount: number;
  lastIndexed: string;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Repositories — CodeIntel" },
      { name: "description", content: "Index your GitHub repositories to enable semantic search and AI reviews." },
    ],
  }),
  component: RepositoriesPage,
});

function timeAgo(iso: string): string {
  if (!iso) return "—";
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function StatusBadge({ status }: { status: Repo["status"] }) {
  const map = {
    ready:    { label: "Ready",    color: "var(--brand-teal)" },
    indexing: { label: "Indexing", color: "var(--brand-amber)" },
    failed:   { label: "Failed",   color: "var(--brand-red)" },
  } as const;
  const { label, color } = map[status];
  return (
    <span className="flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs" style={{ color, borderColor: color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

function RepoCard({ repo }: { repo: Repo }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-1 flex items-center justify-between gap-2">
        <div className="truncate font-mono text-sm font-medium">{repo.name}</div>
        <StatusBadge status={repo.status} />
      </div>
      <div className="mb-4 truncate text-xs text-muted-foreground">{repo.url}</div>
      <div className="flex gap-8">
        <div>
          <div className="text-2xl font-semibold">{repo.fileCount}</div>
          <div className="text-xs text-muted-foreground">files</div>
        </div>
        <div>
          <div className="text-2xl font-semibold">{repo.chunkCount}</div>
          <div className="text-xs text-muted-foreground">chunks</div>
        </div>
      </div>
      {repo.status === "indexing" && (
        <div className="mt-3 h-1 overflow-hidden rounded-full bg-background">
          <div className="h-full w-1/3 animate-pulse rounded-full" style={{ backgroundColor: "var(--brand-amber)" }} />
        </div>
      )}
      <div className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">
        Last indexed: {timeAgo(repo.lastIndexed)}
      </div>
    </div>
  );
}

function ConnectModal({ onClose, onAdded }: { onClose: () => void; onAdded: (r: Repo) => void }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/repositories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const repo = await res.json();
      onAdded({ ...repo, fileCount: 0, chunkCount: 0, lastIndexed: new Date().toISOString() });
      onClose();
    } catch (err) {
      console.error("Failed to add repository:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold">Connect a repository</h2>
        <p className="mt-1 text-sm text-muted-foreground">Paste a public GitHub URL to index it for search.</p>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          className="mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading || !url.trim()}
            className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
            style={{ backgroundColor: "var(--brand-purple)", color: "#0a0a09" }}
          >
            {loading ? "Connecting..." : "Index repository"}
          </button>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Connect a repo",
    body: "Paste any public GitHub URL. The platform clones it and gets to work — no manual setup.",
  },
  {
    n: "02",
    title: "Deep learning indexes it",
    body: "Every function and class gets chunked and converted into a 384-dimension vector using a sentence-transformer embedding model — capturing meaning, not just text.",
  },
  {
    n: "03",
    title: "Ask in plain English",
    body: '"Where do we handle retries?" finds the right code even if it\'s named completely differently — real semantic search, powered by pgvector.',
  },
  {
    n: "04",
    title: "PRs review themselves",
    body: "A GitHub webhook triggers a RAG-powered AI agent the moment a PR opens — it pulls similar code as context and posts a real review comment automatically.",
  },
];

function HowItWorksPanel() {
  return (
    <aside className="w-full max-w-sm shrink-0 lg:sticky lg:top-8 lg:self-start">
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-1 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--brand-purple)" }}>
          What this actually does
        </div>
        <h2 className="mb-4 text-lg font-semibold leading-snug">
          Ctrl+F for meaning, not text.
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
          Keyword search fails the moment your query doesn't share words with the code.
          This platform embeds every function into a vector space so <em>"rate limiting"</em> finds{" "}
          <code className="rounded bg-background px-1 py-0.5 text-xs">throttleRequests()</code>{" "}
          even though they share zero words.
        </p>

        <div className="flex flex-col gap-5">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-3">
              <span
                className="mt-0.5 shrink-0 font-mono text-xs font-bold"
                style={{ color: "var(--brand-purple)" }}
              >
                {s.n}
              </span>
              <div>
                <div className="text-sm font-medium">{s.title}</div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <div className="flex flex-wrap gap-1.5">
            {["FastAPI", "pgvector", "sentence-transformers", "Groq LLaMA 3.3", "React", "Docker"].map((t) => (
              <span
                key={t}
                className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

function RepositoriesPage() {
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const load = () => {
      fetch("/api/repositories")
        .then((r) => r.json())
        .then(setRepos)
        .catch((err) => {
          console.error("Failed to load repositories:", err);
        });
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Repositories</h1>
          <p className="mt-1 text-sm text-muted-foreground">Index your GitHub repositories to enable semantic search and AI reviews.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium"
          style={{ backgroundColor: "var(--brand-purple)", color: "#0a0a09" }}
        >
          + Connect repository
        </button>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          {repos === null ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2].map((i) => <div key={i} className="h-40 animate-pulse rounded-xl bg-card" />)}
            </div>
          ) : repos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <div className="mb-3 text-3xl">📦</div>
              <p className="text-sm font-medium">No repositories yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Connect one to see it indexed here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {repos.map((r) => <RepoCard key={r.id} repo={r} />)}
            </div>
          )}
        </div>

        <HowItWorksPanel />
      </div>

      {modalOpen && (
        <ConnectModal
          onClose={() => setModalOpen(false)}
          onAdded={(r) => setRepos((prev) => [r, ...(prev ?? [])])}
        />
      )}
    </div>
  );
}