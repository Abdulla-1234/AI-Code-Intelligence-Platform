import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-DhPAhERp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Toggle({ checked, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => onChange(!checked),
		className: "relative h-6 w-11 rounded-full border border-border transition-colors",
		style: { backgroundColor: checked ? "var(--brand-purple)" : "var(--secondary)" },
		"aria-pressed": checked,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all",
			style: { left: checked ? "22px" : "2px" }
		})
	});
}
function Section({ title, description, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl border border-border bg-card p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-semibold",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-4",
				children
			})
		]
	});
}
function SettingsPage() {
	const [autoReview, setAutoReview] = (0, import_react.useState)(true);
	const [autoIndex, setAutoIndex] = (0, import_react.useState)(true);
	const [copied, setCopied] = (0, import_react.useState)(null);
	const [showKey, setShowKey] = (0, import_react.useState)(false);
	const webhookUrl = "https://codeintel.example.com/api/webhooks/github";
	const apiKey = "ci_live_9f8a2b7d4c1e6f3a5b8c9d0e1f2a3b4c";
	const copy = async (text, label) => {
		await navigator.clipboard.writeText(text);
		setCopied(label);
		setTimeout(() => setCopied(null), 1500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-semibold tracking-tight",
				children: "Settings"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Manage your integrations and automation."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "GitHub connection",
						description: "CodeIntel uses your GitHub App installation to read repositories and post review comments.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border bg-background p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-9 w-9 items-center justify-center rounded-full",
									style: { backgroundColor: "var(--brand-teal)" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
										width: "18",
										height: "18",
										viewBox: "0 0 24 24",
										fill: "#0a0a09",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M20 6 9 17l-5-5" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "Connected to acme-org"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-xs text-muted-foreground",
									children: "4 repositories accessible"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent",
								children: "Manage"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
						title: "Webhook URL",
						description: "Add this URL to your GitHub App to receive PR events.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								readOnly: true,
								value: webhookUrl,
								className: "flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => copy(webhookUrl, "webhook"),
								className: "rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent",
								children: copied === "webhook" ? "Copied" : "Copy"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "API key",
						description: "Use this key to call the CodeIntel API programmatically. Keep it secret.",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									readOnly: true,
									type: showKey ? "text" : "password",
									value: apiKey,
									className: "flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowKey((v) => !v),
									className: "rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent",
									children: showKey ? "Hide" : "Show"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => copy(apiKey, "key"),
									className: "rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent",
									children: copied === "key" ? "Copied" : "Copy"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "text-xs",
							style: { color: "var(--brand-red)" },
							children: "Regenerate API key"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
						title: "Automation",
						description: "Choose what CodeIntel should do automatically.",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "Auto-review pull requests"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Post an AI review as soon as a PR is opened or updated."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									checked: autoReview,
									onChange: setAutoReview
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t border-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: "Auto-index on push"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: "Re-index the affected files on every push to the default branch."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
									checked: autoIndex,
									onChange: setAutoIndex
								})]
							})
						]
					})
				]
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
