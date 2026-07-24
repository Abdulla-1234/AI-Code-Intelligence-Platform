import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";

// GET /api/repositories -> for the dropdown
// POST /api/search { query, repoId } -> SearchResult[]
// SearchResult = { id: string; filePath: string; functionName: string; score: number; language: string; snippet: string; startLine: number }
type SearchResult = {
  id: string;
  filePath: string;
  functionName: string;
  score: number;
  language: string;
  snippet: string;
  startLine: number;
};

type RepoOption = { id: string; name: string };

const EXAMPLES = [
  "where do we handle authentication",
  "database connection pooling",
  "error retry logic",
  "how are webhooks validated",
  "rate limiting middleware",
];

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Semantic Search — CodeIntel" },
      { name: "description", content: "Ask natural language questions about your codebase and find the exact code." },
    ],
  }),
  component: SearchPage,
});

function ScoreBadge({ score }: { score: number }) {
  // Clip to 0% minimum — cosine similarity can go slightly negative for
  // very dissimilar chunks, but a negative "match" reads as a bug to users.
  const pct = Math.max(0, Math.round(score * 100));
  const color = pct >= 90 ? "var(--brand-teal)" : pct >= 75 ? "var(--brand-blue)" : "var(--brand-amber)";
  return (
    <span className="rounded-md border px-2 py-0.5 font-mono text-xs" style={{ color, borderColor: color }}>
      {pct}% match
    </span>
  );
}

function ResultCard({ r }: { r: SearchResult }) {
  const [expanded, setExpanded] = useState(false);
  const lines = r.snippet.split("\n");
  const preview = expanded ? lines : lines.slice(0, 5);
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="font-mono text-sm">{r.filePath}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            <span className="font-mono" style={{ color: "var(--brand-purple)" }}>{r.functionName}</span>
            <span className="mx-2">·</span>line {r.startLine}
          </div>
        </div>
        <ScoreBadge score={r.score} />
      </div>
      <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed">
        <code>{preview.join("\n")}</code>
      </pre>
      {lines.length > 5 && (
        <button onClick={() => setExpanded((v) => !v)} className="mt-2 text-xs text-muted-foreground hover:text-foreground">
          {expanded ? "Show less" : `Show more (${lines.length - 5} more lines)`}
        </button>
      )}
    </div>
  );
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const [repo, setRepo] = useState("all");
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [repoList, setRepoList] = useState<RepoOption[]>([
    { id: "all", name: "All repositories" },
  ]);

  useEffect(() => {
    fetch("/api/repositories")
      .then((r) => r.json())
      .then((data) => {
        setRepoList([
          { id: "all", name: "All repositories" },
          ...data.map((r: any) => ({ id: r.id, name: r.name })),
        ]);
      })
      .catch((err) => console.error("Failed to load repo list:", err));
  }, []);
  
  const run = async (q: string) => {
    if (!q.trim()) return;
    setQuery(q);
    setLoading(true);
    setResults(null);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, repoId: repo }),
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Semantic Search</h1>
      <p className="mt-1 text-sm text-muted-foreground">Ask questions in plain English. Find the code that answers them.</p>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && run(query)}
            placeholder="Ask anything about your codebase..."
            className="w-full rounded-lg border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
          />
        </div>
        <select
          value={repo}
          onChange={(e) => setRepo(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-3 text-sm outline-none focus:border-primary sm:w-52"
        >
          {repoList.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <button
          onClick={() => run(query)}
          className="rounded-lg px-5 py-3 text-sm font-medium"
          style={{ backgroundColor: "var(--brand-purple)", color: "#0a0a09" }}
        >
          Search
        </button>
      </div>

      <div className="mt-8">
        {loading && (
          <div className="space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-40 animate-pulse rounded-xl bg-card" />)}
          </div>
        )}

        {!loading && results === null && (
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Try an example</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {EXAMPLES.map(ex => (
                <button
                  key={ex}
                  onClick={() => run(ex)}
                  className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && results && results.length > 0 && (
          <div className="space-y-4">
            <div className="text-xs text-muted-foreground">{results.length} results, sorted by similarity</div>
            {results.map(r => <ResultCard key={r.id} r={r} />)}
          </div>
        )}

        {!loading && results && results.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
            No results found for "{query}"
          </div>
        )}
      </div>
    </div>
  );
}