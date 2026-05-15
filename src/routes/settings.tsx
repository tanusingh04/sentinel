import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { useDashboard } from "@/lib/dashboard-context";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Sentinel" },
      { name: "description", content: "Theme, notifications, and AI prioritization preferences." },
    ],
  }),
  component: () => (
    <Shell>
      <SettingsPage />
    </Shell>
  ),
});

function SettingsPage() {
  const { theme, toggleTheme } = useDashboard();
  return (
    <div className="space-y-6 max-w-3xl">
      <header>
        <h1 className="text-3xl font-display font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1">Personalize Sentinel to your operating environment.</p>
      </header>

      <Section title="Appearance">
        <Row label="Dark mode" hint="Recommended for control rooms and low-light environments.">
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </Row>
      </Section>

      <Section title="Notifications">
        <Row label="Critical push alerts" hint="Immediately notify on critical-priority signals."><Switch defaultChecked /></Row>
        <Row label="Audible alarm" hint="Play a tone when a critical alert is created."><Switch defaultChecked /></Row>
        <Row label="Daily digest" hint="Email summary of resolved and pending alerts."><Switch /></Row>
      </Section>

      <Section title="AI prioritization">
        <Row label="Auto-rank alerts" hint="Use AI confidence to reorder the queue."><Switch defaultChecked /></Row>
        <Row label="Suggest probable causes" hint="Surface likely root causes inside engineer cards."><Switch defaultChecked /></Row>
        <Row label="Auto-escalate >95% confidence" hint="Promote high-confidence anomalies to critical."><Switch /></Row>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">{title}</div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="px-5 py-4 flex items-center justify-between gap-6">
      <div>
        <Label className="text-sm font-medium">{label}</Label>
        {hint && <div className="text-xs text-muted-foreground mt-0.5">{hint}</div>}
      </div>
      {children}
    </div>
  );
}
