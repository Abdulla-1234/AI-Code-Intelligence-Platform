import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-5FM-DvXk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EXAMPLES = [
	"where do we handle authentication",
	"database connection pooling",
	"error retry logic",
	"how are webhooks validated",
	"rate limiting middleware"
];
function ScoreBadge({ score }) {
	const pct = Math.max(0, Math.round(score * 100));
	const color = pct >= 90 ? "var(--brand-teal)" : pct >= 75 ? "var(--brand-blue)" : "var(--brand-amber)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "rounded-md border px-2 py-0.5 font-mono text-xs",
		style: {
			color,
			borderColor: color
		},
		children: [pct, "% match"]
	});
}
function ResultCard({ r }) {
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const lines = r.snippet.split("\n");
	const preview = expanded ? lines : lines.slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex flex-wrap items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-mono text-sm",
						children: r.filePath
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-0.5 text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono",
								style: { color: "var(--brand-purple)" },
								children: r.functionName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-2",
								children: "·"
							}),
							"line ",
							r.startLine
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreBadge, { score: r.score })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-xs leading-relaxed",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: preview.join("\n") })
			}),
			lines.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setExpanded((v) => !v),
				className: "mt-2 text-xs text-muted-foreground hover:text-foreground",
				children: expanded ? "Show less" : `Show more (${lines.length - 5} more lines)`
			})
		]
	});
}
function SearchPage() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [repo, setRepo] = (0, import_react.useState)("all");
	const [results, setResults] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [repoList, setRepoList] = (0, import_react.useState)([{
		id: "all",
		name: "All repositories"
	}]);
	(0, import_react.useEffect)(() => {
		fetch("/api/repositories").then((r) => r.json()).then((data) => {
			setRepoList([{
				id: "all",
				name: "All repositories"
			}, ...data.map((r) => ({
				id: r.id,
				name: r.name
			}))]);
		}).catch((err) => console.error("Failed to load repo list:", err));
	}, []);
	const run = async (q) => {
		if (!q.trim()) return;
		setQuery(q);
		setLoading(true);
		setResults(null);
		try {
			const data = await (await fetch("/api/search", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					query: q,
					repoId: repo
				})
			})).json();
			setResults(data);
		} catch (err) {
			console.error("Search failed:", err);
			setResults([]);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Semantic Search"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Ask questions in plain English. Find the code that answers them."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-2 sm:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground",
							width: "18",
							height: "18",
							viewBox: "0 0 24 24",
							fill: "none",
							stroke: "currentColor",
							strokeWidth: "1.8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx: "11",
								cy: "11",
								r: "7"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m20 20-3.5-3.5" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							onKeyDown: (e) => e.key === "Enter" && run(query),
							placeholder: "Ask anything about your codebase...",
							className: "w-full rounded-lg border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none focus:border-primary"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: repo,
						onChange: (e) => setRepo(e.target.value),
						className: "rounded-lg border border-border bg-card px-3 py-3 text-sm outline-none focus:border-primary sm:w-52",
						children: repoList.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: r.id,
							children: r.name
						}, r.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => run(query),
						className: "rounded-lg px-5 py-3 text-sm font-medium",
						style: {
							backgroundColor: "var(--brand-purple)",
							color: "#0a0a09"
						},
						children: "Search"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: [
							1,
							2,
							3
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-card" }, i))
					}),
					!loading && results === null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-wide text-muted-foreground",
						children: "Try an example"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: EXAMPLES.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => run(ex),
							className: "rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground hover:border-primary/50 hover:text-foreground",
							children: ex
						}, ex))
					})] }),
					!loading && results && results.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [results.length, " results, sorted by similarity"]
						}), results.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultCard, { r }, r.id))]
					}),
					!loading && results && results.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground",
						children: [
							"No results found for \"",
							query,
							"\""
						]
					})
				]
			})
		]
	});
}
//#endregion
export { SearchPage as component };
