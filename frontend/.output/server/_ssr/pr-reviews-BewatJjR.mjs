import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pr-reviews-BewatJjR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function timeAgo(iso) {
	const diffMs = Date.now() - new Date(iso).getTime();
	const mins = Math.floor(diffMs / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
}
function mapSeverity(s) {
	if (s === "high" || s === "medium" || s === "low") return s;
	return "low";
}
function transform(raw) {
	const issues = (raw.issuesFound || []).map((iss, idx) => ({
		id: `${raw.id}-${idx}`,
		severity: mapSeverity(iss.severity),
		file: iss.file,
		line: iss.line || 0,
		message: iss.description,
		suggestion: iss.suggestion
	}));
	let status = "reviewed";
	if (raw.status === "pending") status = "pending";
	if (raw.status === "failed") status = "failed";
	let outcome = "no-issues";
	if (issues.length > 0) outcome = issues.some((i) => i.severity === "high") ? "issues-found" : "suggestions";
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
		issues
	};
}
function OutcomeBadge({ pr }) {
	if (pr.status === "pending") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full border px-2 py-0.5 text-xs",
		style: {
			color: "var(--brand-blue)",
			borderColor: "var(--brand-blue)"
		},
		children: "Pending"
	});
	if (pr.status === "failed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full border px-2 py-0.5 text-xs",
		style: {
			color: "var(--brand-red)",
			borderColor: "var(--brand-red)"
		},
		children: "Failed"
	});
	const { label, color } = {
		"no-issues": {
			label: "No issues",
			color: "var(--brand-teal)"
		},
		"suggestions": {
			label: "Suggestions",
			color: "var(--brand-amber)"
		},
		"issues-found": {
			label: "Issues found",
			color: "var(--brand-red)"
		}
	}[pr.outcome];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-full border px-2 py-0.5 text-xs",
		style: {
			color,
			borderColor: color
		},
		children: label
	});
}
function SeverityBadge({ s }) {
	const map = {
		high: "var(--brand-red)",
		medium: "var(--brand-amber)",
		low: "var(--brand-blue)"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
		style: {
			color: map[s],
			backgroundColor: `${map[s]}18`
		},
		children: s
	});
}
function PRReviewsPage() {
	const [reviews, setReviews] = (0, import_react.useState)(null);
	const [expanded, setExpanded] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const load = () => {
			fetch("/api/pr-reviews").then((r) => r.json()).then((data) => setReviews(data.map(transform))).catch((err) => {
				console.error("Failed to load PR reviews:", err);
				setReviews([]);
			});
		};
		load();
		const interval = setInterval(load, 5e3);
		return () => clearInterval(interval);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "PR Reviews"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Automated code reviews across your pull requests."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 overflow-hidden rounded-xl border border-border bg-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-[80px_1fr_180px_140px_100px_100px] gap-4 border-b border-border px-5 py-3 text-xs uppercase tracking-wide text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "PR" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Title" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Repository" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "Issues" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "When" })
					]
				}), reviews === null ? [
					1,
					2,
					3
				].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-14 animate-pulse border-b border-border" }, i)) : reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-5 py-12 text-center text-sm text-muted-foreground",
					children: "No PR reviews yet. Open a pull request on a tracked repository to see AI reviews appear here."
				}) : reviews.map((pr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border last:border-b-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setExpanded((e) => e === pr.id ? null : pr.id),
						className: "grid w-full grid-cols-[80px_1fr_180px_140px_100px_100px] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/40",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-mono text-sm text-muted-foreground",
								children: ["#", pr.number]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate text-sm font-medium",
								children: pr.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "truncate font-mono text-xs text-muted-foreground",
								children: pr.repo
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OutcomeBadge, { pr }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm",
								children: pr.issuesCount > 0 ? pr.issuesCount : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: pr.timestamp
							})
						]
					}), expanded === pr.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border bg-background/50 px-5 py-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs uppercase tracking-wide text-muted-foreground",
								children: "AI review summary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed",
								children: pr.summary
							}),
							pr.issues.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs uppercase tracking-wide text-muted-foreground",
									children: [
										"Flagged issues (",
										pr.issues.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 space-y-3",
									children: pr.issues.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border bg-card p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SeverityBadge, { s: i.severity }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-mono text-xs text-muted-foreground",
													children: [
														i.file,
														":",
														i.line
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-sm",
												children: i.message
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 rounded-md border-l-2 bg-background p-3 text-xs",
												style: { borderColor: "var(--brand-purple)" },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mb-1 text-[10px] uppercase tracking-wide text-muted-foreground",
													children: "Suggested fix"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-mono leading-relaxed",
													children: i.suggestion
												})]
											})
										]
									}, i.id))
								})]
							})
						]
					})]
				}, pr.id))]
			})
		]
	});
}
//#endregion
export { PRReviewsPage as component };
