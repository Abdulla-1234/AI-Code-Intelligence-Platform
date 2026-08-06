import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DYzUH8UK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function timeAgo(iso) {
	if (!iso) return "—";
	const diffMs = Date.now() - new Date(iso).getTime();
	const mins = Math.floor(diffMs / 6e4);
	if (mins < 1) return "just now";
	if (mins < 60) return `${mins}m ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	return `${Math.floor(hours / 24)}d ago`;
}
function StatusBadge({ status }) {
	const { label, color } = {
		ready: {
			label: "Ready",
			color: "var(--brand-teal)"
		},
		indexing: {
			label: "Indexing",
			color: "var(--brand-amber)"
		},
		failed: {
			label: "Failed",
			color: "var(--brand-red)"
		}
	}[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
		style: {
			color,
			borderColor: color
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "h-1.5 w-1.5 rounded-full",
			style: { backgroundColor: color }
		}), label]
	});
}
function RepoCard({ repo }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate font-mono text-sm font-medium",
					children: repo.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: repo.status })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 truncate text-xs text-muted-foreground",
				children: repo.url
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xl font-semibold",
					children: repo.fileCount
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: "files"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-2xl font-semibold",
					children: repo.chunkCount
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: "chunks"
				})] })]
			}),
			repo.status === "indexing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-1 overflow-hidden rounded-full bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full w-1/3 animate-pulse rounded-full",
					style: { backgroundColor: "var(--brand-amber)" }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 border-t border-border pt-3 text-xs text-muted-foreground",
				children: ["Last indexed: ", timeAgo(repo.lastIndexed)]
			})
		]
	});
}
function ConnectModal({ onClose, onAdded }) {
	const [url, setUrl] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const submit = async () => {
		if (!url.trim()) return;
		setLoading(true);
		try {
			onAdded({
				...await (await fetch("/api/repositories", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ url })
				})).json(),
				fileCount: 0,
				chunkCount: 0,
				lastIndexed: (/* @__PURE__ */ new Date()).toISOString()
			});
			onClose();
		} catch (err) {
			console.error("Failed to add repository:", err);
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/70",
		onClick: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-xl border border-border bg-card p-6",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold",
					children: "Connect a repository"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Paste a public GitHub URL to index it for search."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: url,
					onChange: (e) => setUrl(e.target.value),
					placeholder: "https://github.com/owner/repo",
					className: "mt-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary",
					onKeyDown: (e) => e.key === "Enter" && submit()
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex justify-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-lg px-4 py-2 text-sm text-muted-foreground hover:text-foreground",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: submit,
						disabled: loading || !url.trim(),
						className: "rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50",
						style: {
							backgroundColor: "var(--brand-purple)",
							color: "#0a0a09"
						},
						children: loading ? "Connecting..." : "Index repository"
					})]
				})
			]
		})
	});
}
var STEPS = [
	{
		n: "01",
		title: "Connect a repo",
		body: "Paste any public GitHub URL. The platform clones it and gets to work — no manual setup."
	},
	{
		n: "02",
		title: "Deep learning indexes it",
		body: "Every function and class gets chunked and converted into a 384-dimension vector using a sentence-transformer embedding model — capturing meaning, not just text."
	},
	{
		n: "03",
		title: "Ask in plain English",
		body: "\"Where do we handle retries?\" finds the right code even if it's named completely differently — real semantic search, powered by pgvector."
	},
	{
		n: "04",
		title: "PRs review themselves",
		body: "A GitHub webhook triggers a RAG-powered AI agent the moment a PR opens — it pulls similar code as context and posts a real review comment automatically."
	}
];
function HowItWorksPanel() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "w-full max-w-sm shrink-0 lg:sticky lg:top-8 lg:self-start",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 text-xs font-medium uppercase tracking-wider",
					style: { color: "var(--brand-purple)" },
					children: "What this actually does"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-4 text-lg font-semibold leading-snug",
					children: "Ctrl+F for meaning, not text."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-6 text-sm leading-relaxed text-muted-foreground",
					children: [
						"Keyword search fails the moment your query doesn't share words with the code. This platform embeds every function into a vector space so ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "\"rate limiting\"" }),
						" finds",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-background px-1 py-0.5 text-xs",
							children: "throttleRequests()"
						}),
						" ",
						"even though they share zero words."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-5",
					children: STEPS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 shrink-0 font-mono text-xs font-bold",
							style: { color: "var(--brand-purple)" },
							children: s.n
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-medium",
							children: s.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted-foreground",
							children: s.body
						})] })]
					}, s.n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 border-t border-border pt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1.5",
						children: [
							"FastAPI",
							"pgvector",
							"sentence-transformers",
							"Groq LLaMA 3.3",
							"React",
							"Docker"
						].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground",
							children: t
						}, t))
					})
				})
			]
		})
	});
}
function RepositoriesPage() {
	const [repos, setRepos] = (0, import_react.useState)(null);
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const load = () => {
			fetch("/api/repositories").then((r) => r.json()).then(setRepos).catch((err) => {
				console.error("Failed to load repositories:", err);
			});
		};
		load();
		const interval = setInterval(load, 3e3);
		return () => clearInterval(interval);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Repositories"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Index your GitHub repositories to enable semantic search and AI reviews."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setModalOpen(true),
					className: "shrink-0 rounded-lg px-4 py-2 text-sm font-medium",
					style: {
						backgroundColor: "var(--brand-purple)",
						color: "#0a0a09"
					},
					children: "+ Connect repository"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-8 lg:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1",
					children: repos === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
						children: [1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-card" }, i))
					}) : repos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-dashed border-border bg-card p-12 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3 text-3xl",
								children: "📦"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "No repositories yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: "Connect one to see it indexed here."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
						children: repos.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RepoCard, { repo: r }, r.id))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HowItWorksPanel, {})]
			}),
			modalOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectModal, {
				onClose: () => setModalOpen(false),
				onAdded: (r) => setRepos((prev) => [r, ...prev ?? []])
			})
		]
	});
}
//#endregion
export { RepositoriesPage as component };
