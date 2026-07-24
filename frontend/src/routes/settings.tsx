import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

// GET/PUT /api/settings

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CodeIntel" },
      { name: "description", content: "Configure GitHub, webhooks, and automation for CodeIntel." },
    ],
  }),
  component: SettingsPage,
});

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="relative h-6 w-11 rounded-full border border-border transition-colors"
      style={{ backgroundColor: checked ? "var(--brand-purple)" : "var(--secondary)" }}
      aria-pressed={checked}
    >
      <span
        className="absolute top-0.5 h-4 w-4 rounded-full bg-background transition-all"
        style={{ left: checked ? "22px" : "2px" }}
      />
    </button>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function SettingsPage() {
  const [autoReview, setAutoReview] = useState(true);
  const [autoIndex, setAutoIndex] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);

  const webhookUrl = "https://codeintel.example.com/api/webhooks/github";
  const apiKey = "ci_live_9f8a2b7d4c1e6f3a5b8c9d0e1f2a3b4c";

  const copy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">Manage your integrations and automation.</p>

      <div className="mt-6 space-y-5">
        <Section title="GitHub connection" description="CodeIntel uses your GitHub App installation to read repositories and post review comments.">
          <div className="flex items-center justify-between rounded-lg border border-border bg-background p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: "var(--brand-teal)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0a0a09"><path d="M20 6 9 17l-5-5"/></svg>
              </div>
              <div>
                <div className="text-sm font-medium">Connected to acme-org</div>
                <div className="font-mono text-xs text-muted-foreground">4 repositories accessible</div>
              </div>
            </div>
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-accent">Manage</button>
          </div>
        </Section>

        <Section title="Webhook URL" description="Add this URL to your GitHub App to receive PR events.">
          <div className="flex gap-2">
            <input readOnly value={webhookUrl} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs" />
            <button onClick={() => copy(webhookUrl, "webhook")} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent">
              {copied === "webhook" ? "Copied" : "Copy"}
            </button>
          </div>
        </Section>

        <Section title="API key" description="Use this key to call the CodeIntel API programmatically. Keep it secret.">
          <div className="flex gap-2">
            <input readOnly type={showKey ? "text" : "password"} value={apiKey} className="flex-1 rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs" />
            <button onClick={() => setShowKey(v => !v)} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent">
              {showKey ? "Hide" : "Show"}
            </button>
            <button onClick={() => copy(apiKey, "key")} className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent">
              {copied === "key" ? "Copied" : "Copy"}
            </button>
          </div>
          <button className="text-xs" style={{ color: "var(--brand-red)" }}>Regenerate API key</button>
        </Section>

        <Section title="Automation" description="Choose what CodeIntel should do automatically.">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Auto-review pull requests</div>
              <div className="text-xs text-muted-foreground">Post an AI review as soon as a PR is opened or updated.</div>
            </div>
            <Toggle checked={autoReview} onChange={setAutoReview} />
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">Auto-index on push</div>
              <div className="text-xs text-muted-foreground">Re-index the affected files on every push to the default branch.</div>
            </div>
            <Toggle checked={autoIndex} onChange={setAutoIndex} />
          </div>
        </Section>
      </div>
    </div>
  );
}
