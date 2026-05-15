import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { ALERTS, sortByPriority } from "@/lib/mock-alerts";
import { Bell, AlertOctagon, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notification Center — Sentinel" },
      { name: "description", content: "All recent alerts and system messages in one place." },
    ],
  }),
  component: () => (
    <Shell>
      <NotificationsPage />
    </Shell>
  ),
});

function NotificationsPage() {
  const list = sortByPriority(ALERTS);
  return (
    <div className="space-y-6 max-w-3xl">
      <header className="flex items-center gap-3">
        <Bell className="size-6 text-khaki" />
        <div>
          <h1 className="text-3xl font-display font-semibold">Notification center</h1>
          <p className="text-muted-foreground mt-1">{list.length} recent events.</p>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
        {list.map((a) => {
          const Icon = a.priority === "critical" ? AlertOctagon : a.status === "resolved" ? CheckCircle2 : Info;
          const tone =
            a.priority === "critical" ? "text-critical bg-critical/10" :
            a.status === "resolved" ? "text-success bg-success/10" :
            "text-khaki bg-khaki/10";
          return (
            <div key={a.id} className="flex items-start gap-4 p-4 hover:bg-surface/40 transition-colors">
              <div className={cn("size-10 rounded-xl flex items-center justify-center shrink-0", tone)}>
                <Icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{a.id}</span>
                  <span className="text-[10px] uppercase tracking-wider font-semibold">{a.priority}</span>
                </div>
                <div className="text-sm font-medium truncate mt-0.5">{a.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.device} · {a.system}</div>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{new Date(a.timestamp).toLocaleTimeString()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
