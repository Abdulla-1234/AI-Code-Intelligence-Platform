import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { c as HeadContent, d as Outlet, f as lazyRouteComponent, g as useRouter, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BqHZkFBy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-wDL8rvhb.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	window.__lovableReportRuntimeError?.({
		message,
		stack: error instanceof Error ? error.stack : void 0,
		filename: window.location.pathname
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
					children: "Go home"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-lg border border-border bg-card px-4 py-2 text-sm hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$4 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "CodeIntel — AI Code Intelligence" },
			{
				name: "description",
				content: "Semantic code search and AI-powered PR review platform for your repositories."
			},
			{
				property: "og:title",
				content: "CodeIntel — AI Code Intelligence"
			},
			{
				property: "og:description",
				content: "Semantic code search and AI-powered PR review platform."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}, {
			rel: "icon",
			href: "/favicon.ico",
			type: "image/x-icon"
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function IconRepo() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5a2.5 2.5 0 0 0 0 5H20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6.5 15H20" })]
	});
}
function IconSearch() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "11",
			cy: "11",
			r: "7"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m20 20-3.5-3.5" })]
	});
}
function IconPR() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "6",
				cy: "6",
				r: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "6",
				cy: "18",
				r: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "18",
				cy: "18",
				r: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 8v8" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18 16V10a4 4 0 0 0-4-4h-3" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m14 3-3 3 3 3" })
		]
	});
}
function IconSettings() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: "18",
		height: "18",
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "3"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.24.6.82 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" })]
	});
}
var NAV = [
	{
		to: "/",
		label: "Repositories",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconRepo, {})
	},
	{
		to: "/search",
		label: "Search",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSearch, {})
	},
	{
		to: "/pr-reviews",
		label: "PR Reviews",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconPR, {})
	},
	{
		to: "/settings",
		label: "Settings",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconSettings, {})
	}
];
function ConnectionPill() {
	const [status, setStatus] = (0, import_react.useState)("connecting");
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => setStatus("live"), 900);
		return () => clearTimeout(t);
	}, []);
	const { label, color } = {
		live: {
			label: "Live",
			color: "var(--brand-teal)"
		},
		connecting: {
			label: "Connecting",
			color: "var(--brand-amber)"
		},
		disconnected: {
			label: "Disconnected",
			color: "var(--brand-red)"
		}
	}[status];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative flex h-2 w-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute inline-flex h-full w-full animate-ping rounded-full opacity-60",
				style: { backgroundColor: color }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "relative inline-flex h-2 w-2 rounded-full",
				style: { backgroundColor: color }
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: label
		})]
	});
}
function Navbar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/",
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-7 w-7 items-center justify-center rounded-md",
				style: { backgroundColor: "var(--brand-purple)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-sm font-bold text-background",
					children: "</>"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-semibold tracking-tight",
				children: "CodeIntel"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectionPill, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
				style: {
					backgroundColor: "var(--brand-blue)",
					color: "#0a0a09"
				},
				children: "JD"
			})]
		})]
	});
}
function Sidebar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: "hidden w-56 shrink-0 border-r border-border bg-background md:block",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "sticky top-14 flex flex-col gap-1 p-3",
			children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				activeOptions: { exact: item.to === "/" },
				className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
				activeProps: { className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm bg-accent text-foreground" },
				children: [item.icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.label })]
			}, item.to))
		})
	});
}
function RootComponent() {
	const { queryClient } = Route$4.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-h-screen bg-background text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})]
			})]
		})
	});
}
var $$splitComponentImporter$3 = () => import("./routes-DYzUH8UK.mjs");
var Route$3 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Repositories — CodeIntel" }, {
		name: "description",
		content: "Index your GitHub repositories to enable semantic search and AI reviews."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./pr-reviews-BewatJjR.mjs");
var Route$2 = createFileRoute("/pr-reviews")({
	head: () => ({ meta: [{ title: "PR Reviews — CodeIntel" }, {
		name: "description",
		content: "AI-generated review comments and flagged issues for your pull requests."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./search-5FM-DvXk.mjs");
var Route$1 = createFileRoute("/search")({
	head: () => ({ meta: [{ title: "Semantic Search — CodeIntel" }, {
		name: "description",
		content: "Ask natural language questions about your codebase and find the exact code."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./settings-DhPAhERp.mjs");
var Route = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Settings — CodeIntel" }, {
		name: "description",
		content: "Configure GitHub, webhooks, and automation for CodeIntel."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	PrReviewsRoute: Route$2.update({
		id: "/pr-reviews",
		path: "/pr-reviews",
		getParentRoute: () => Route$4
	}),
	SearchRoute: Route$1.update({
		id: "/search",
		path: "/search",
		getParentRoute: () => Route$4
	}),
	SettingsRoute: Route.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
