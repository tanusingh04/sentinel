import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { useDashboard, type Role } from "@/lib/dashboard-context";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roles")({
  head: () => ({
    meta: [
      { title: "Role Management — Sentinel" },
      { name: "description", content: "Switch between Operator and Engineer dashboards." },
    ],
  }),
  component: () => (
    <Shell>
      <RolesPage />
    </Shell>
  ),
});

const ROLES: { id: Role; title: string; pitch: string; perks: string[] }[] = [
  {
    id: "operator",
    title: "Operator",
    pitch: "Streamlined view focused on active alerts and quick actions.",
    perks: ["Active alert focus", "One-tap acknowledge / resolve / escalate", "Minimal technical noise", "Audio + push notifications"],
  },
  {
    id: "engineer",
    title: "Engineer",
    pitch: "Deep telemetry, root-cause analysis, and historical trends.",
    perks: ["Detailed logs & metrics", "AI root cause suggestions", "Performance history graphs", "Troubleshooting playbooks"],
  },
];

function RolesPage() {
  const { role, setRole } = useDashboard();
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-display font-semibold">Role management</h1>
        <p className="text-muted-foreground mt-1">Choose how Sentinel should adapt to your workflow.</p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {ROLES.map((r) => {
          const active = role === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setRole(r.id)}
              className={cn(
                "text-left rounded-2xl border p-6 transition-all hover:shadow-elevated",
                active ? "border-khaki bg-khaki/10 shadow-glow" : "border-border bg-card",
              )}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-display font-semibold">{r.title}</h2>
                {active && (
                  <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-khaki text-khaki-foreground font-medium">
                    <Check className="size-3" /> Active
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-2">{r.pitch}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {r.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <Check className="size-4 text-khaki mt-0.5 shrink-0" /> <span>{p}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>
    </div>
  );
}
