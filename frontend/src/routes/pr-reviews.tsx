import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// GET /api/pr-reviews -> raw rows from our FastAPI backend, shape:
// { id, prNumber, reviewText, issuesFound, status, createdAt, repoName }
type Severity = "high" | "medium" | "low";
type Issue = { id: string; severity: Severity; file: string; line: number; message: string; suggestion: string };
type PRReview = {
  id: string;
  number: number;
  title: string;
  repo: string;
  status: "reviewed" | "pending" | "failed";
  outcome: "no-issues" | "suggestions" | "issues-found";
  issuesCount: number;
  timestamp: string;
  summary: string;
  issues: Issue[];
};

// Raw shape returned by GET /api/pr-reviews
type RawPRReview = {
  id: string;
  prNumber: number;
  reviewText: string;
  issuesFound: { severity: string; file: string; line: number; description: string; suggestion: string }[] | null;
  status: string; // "issues_found" | "no_issues" | "pending" | "failed"
  createdAt: string;
  repoName: string;
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function mapSeverity(s: string): Severity {
  if (s === "high" || s === "medium" || s === "low") return s;
  return "low";
}

function transform(raw: RawPRReview): PRReview {
  const issues: Issue[] = (raw.issuesFound || []).map((iss, idx) => ({
    id: `${raw.id}-${idx}`,
    severity: mapSeverity(iss.severity),
    file: iss.file,
    line: iss.line || 0,
    message: iss.description,
    suggestion: iss.suggestion,
  }));

  let status: PRReview["status"] = "reviewed";
  if (raw.status === "pending") status = "pending";
  if (raw.status === "failed") status = "failed";

  let outcome: PRReview["outcome"] = "no-issues";
  if (issues.length > 0) {
    outcome = issues.some((i) => i.severity === "high") ? "issues-found" : "suggestions";
  }

  return {
    id: raw.id,
    number: raw.prNumber,
    title: `PR #${raw.prNumber} in ${raw.repoName}`,
    repo: raw.repoName,
    status,
    outcome,
    issuesCount: issues.length,
    timestamp: timeAgo(raw.createdAt),
    summary: raw.reviewText || "Review in progress...",
    issues,
  };
}

export const Route = createFileRoute("/pr-reviews")({
  head: () => ({
    meta: [
      { title: "PR Reviews — CodeIntel" },
      { name: "description", content: "AI-generated review comments and flagged issues for your pull requests." },
    ],
  }),
  component: PRReviewsPage,
});

function OutcomeBadge({ pr }: { pr: PRReview }) {
  if (pr.status === "pending") return <span className="rounded-full border px-2 py-0.5 text-xs" style={{ color: "var(--brand-blue)", borderColor: "var(--brand-blue)" }}>Pending</span>;
  if (pr.status === "failed") return <span className="rounded-full border px-2 py-0.5 text-xs" style={{ color: "var(--brand-red)", borderColor: "var(--brand-red)" }}>Failed</span>;
  const map = {
    "no-issues": { label: "No issues", color: "var(--brand-teal)" },
    "suggestions": { label: "Suggestions", color: "var(--brand-amber)" },
    "issues-found": { label: "Issues found", color: "var(--brand-red)" },
  } as const;
  const { label, color } = map[pr.outcome];
  return <span className="rounded-full border px-2 py-0.5 text-xs" style={{ color, borderColor: color }}>{label}</span>;
}

function SeverityBadge({ s }: { s: Severity }) {
  const map = { high: "var(--brand-red)", medium: "var(--brand-amber)", low: "var(--brand-blue)" } as const;
  return (
    <span className="rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" style={{ color: map[s], backgroundColor: `${map[s]}18` }}>
      {s}
    </span>
  );
}

function PRReviewsPage() {
  const [reviews, setReviews] = useState<PRReview[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const load = () => {
      fetch("/api/pr-reviews")
        .then((r) => r.json())
        .then((data: RawPRReview[]) => setReviews(data.map(transform)))
        .catch((err) => {
          console.error("Failed to load PR reviews:", err);
          setReviews([]);
        });
    };

    load(); // initial fetch
    const interval = setInterval(load, 5000); // poll every 5s for new reviews
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">PR Reviews</h1>
      <p className="mt-1 text-sm text-muted-foreground">Automated code reviews across your pull requests.</p>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <div className="grid grid-cols-[80px_1fr_180px_140px_100px_100px] gap-4 border-b border-border px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground">
          <div>PR</div><div>Title</div><div>Repository</div><div>Status</div><div>Issues</div><div>When</div>
        </div>
        {reviews === null ? (
          [1,2,3].map(i => <div key={i} className="h-14 animate-pulse border-b border-border" />)
        ) : reviews.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-muted-foreground">
            No PR reviews yet. Open a pull request on a tracked repository to see AI reviews appear here.
          </div>
        ) : (
          reviews.map(pr => (
            <div key={pr.id} className="border-b border-border last:border-b-0">
              <button
                onClick={() => setExpanded(e => e === pr.id ? null : pr.id)}
                className="grid w-full grid-cols-[80px_1fr_180px_140px_100px_100px] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/40"
              >
                <div className="font-mono text-sm text-muted-foreground">#{pr.number}</div>
                <div className="truncate text-sm font-medium">{pr.title}</div>
                <div className="truncate font-mono text-xs text-muted-foreground">{pr.repo}</div>
                <div><OutcomeBadge pr={pr} /></div>
                <div className="text-sm">{pr.issuesCount > 0 ? pr.issuesCount : "—"}</div>
                <div className="text-xs text-muted-foreground">{pr.timestamp}</div>
              </button>

              {expanded === pr.id && (
                <div className="border-t border-border bg-background/50 px-5 py-5">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">AI review summary</div>
                  <p className="mt-2 text-sm leading-relaxed">{pr.summary}</p>

                  {pr.issues.length > 0 && (
                    <div className="mt-6">
                      <div className="text-xs uppercase tracking-wide text-muted-foreground">Flagged issues ({pr.issues.length})</div>
                      <div className="mt-3 space-y-3">
                        {pr.issues.map(i => (
                          <div key={i.id} className="rounded-lg border border-border bg-card p-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <SeverityBadge s={i.severity} />
                              <span className="font-mono text-xs text-muted-foreground">{i.file}:{i.line}</span>
                            </div>
                            <p className="mt-2 text-sm">{i.message}</p>
                            <div className="mt-3 rounded-md border-l-2 bg-background p-3 text-xs" style={{ borderColor: "var(--brand-purple)" }}>
                              <div className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">Suggested fix</div>
                              <div className="font-mono leading-relaxed">{i.suggestion}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}