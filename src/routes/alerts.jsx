import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { ALERTS, sortByPriority } from "@/lib/mock-alerts";
import { useDashboard } from "@/lib/dashboard-context";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts Management — Sentinel" },
      { name: "description", content: "Filter, search, and act on prioritized industrial alerts." },
    ],
  }),
  component: () => (
    <Shell>
      <AlertsPage />
    </Shell>
  ),
});

const priorities = ["all", "critical", "medium", "low"];
const statuses = ["all", "pending", "in_progress", "resolved"];

function AlertsPage() {
  const { role } = useDashboard();
  const [alerts, setAlerts] = useState(ALERTS);
  const [q, setQ] = useState("");
  const [pf, setPf] = useState("all");
  const [sf, setSf] = useState("all");

  const filtered = useMemo(() => {
    return sortByPriority(alerts).filter((a) => {
      if (pf !== "all" && a.priority !== pf) return false;
      if (sf !== "all" && a.status !== sf) return false;
      if (
        q &&
        !`${a.title} ${a.device} ${a.system} ${a.id}`.toLowerCase().includes(q.toLowerCase())
      )
        return false;
      return true;
    });
  }, [alerts, q, pf, sf]);

  const handleAction = (id, action) => {
    setAlerts((cur) =>
      cur.map((a) =>
        a.id === id
          ? {
              ...a,
              status:
                action === "resolve"
                  ? "resolved"
                  : action === "acknowledge"
                    ? "in_progress"
                    : a.status,
              priority: action === "escalate" ? "critical" : a.priority,
            }
          : a,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-display font-semibold">Alerts management</h1>
        <p className="text-muted-foreground mt-1">
          {filtered.length} alert{filtered.length === 1 ? "" : "s"} matching your filters.
        </p>
      </header>

      <div className="rounded-2xl border border-border bg-card p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by ID, device, or text"
            className="pl-9 bg-surface/60 border-border"
          />
        </div>
        <Pills label="Priority" options={priorities} value={pf} onChange={(v) => setPf(v)} />
        <Pills label="Status" options={statuses} value={sf} onChange={(v) => setSf(v)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((a) => (
          <AlertCard key={a.id} alert={a} variant={role} onAction={handleAction} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12 border border-dashed border-border rounded-2xl">
            No alerts match these filters.
          </div>
        )}
      </div>
    </div>
  );
}

function Pills({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      <div className="flex items-center rounded-lg bg-surface/60 border border-border p-1 flex-wrap">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-md capitalize transition-all",
              value === o
                ? "bg-khaki text-khaki-foreground font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.replace("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
