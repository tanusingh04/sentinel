import { memo } from "react";
import { Clock, Cpu, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";
import type { Alert, Priority, Status } from "@/lib/mock-alerts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const priorityStyles: Record<Priority, string> = {
  critical: "bg-critical/15 text-critical border-critical/30",
  medium: "bg-khaki/20 text-khaki border-khaki/40",
  low: "bg-info/15 text-info border-info/30",
};

const statusStyles: Record<Status, string> = {
  pending: "bg-critical/10 text-critical",
  in_progress: "bg-khaki/15 text-khaki",
  resolved: "bg-success/15 text-success",
};

const statusLabel: Record<Status, string> = {
  pending: "Pending",
  in_progress: "In progress",
  resolved: "Resolved",
};

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 60000;
  if (diff < 1) return "just now";
  if (diff < 60) return `${Math.round(diff)}m ago`;
  const h = diff / 60;
  if (h < 24) return `${Math.round(h)}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

interface Props {
  alert: Alert;
  variant?: "operator" | "engineer";
  onAction?: (id: string, action: "acknowledge" | "resolve" | "escalate") => void;
}

export const AlertCard = memo(function AlertCard({ alert, variant = "operator", onAction }: Props) {
  const isCritical = alert.priority === "critical";

  return (
    <article
      className={cn(
        "relative rounded-2xl border bg-card text-card-foreground p-5 transition-all hover:shadow-elevated",
        isCritical ? "border-critical/40" : "border-border",
      )}
    >
      {isCritical && (
        <span className="absolute -top-1 -right-1 size-3 rounded-full bg-critical pulse-dot" />
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-md border",
              priorityStyles[alert.priority],
            )}
          >
            <AlertTriangle className="size-3" />
            {alert.priority}
          </span>
          <span className={cn("text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md", statusStyles[alert.status])}>
            {statusLabel[alert.status]}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">{alert.id}</span>
        </div>
        <div className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="size-3" />
          {timeAgo(alert.timestamp)}
        </div>
      </div>

      <h3 className="mt-3 text-base font-semibold leading-snug">{alert.title}</h3>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Cpu className="size-3" /> {alert.device}
        </span>
        <span>· {alert.system}</span>
        {alert.metric && (
          <span className="font-mono text-foreground">
            {alert.metric.label}: {alert.metric.value}{alert.metric.unit}
          </span>
        )}
      </div>

      {variant === "engineer" && (
        <div className="mt-4 rounded-lg bg-surface/60 border border-border p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
            AI · Probable causes
          </div>
          <ul className="text-xs space-y-0.5">
            {alert.probableCauses.map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-khaki" /> {c}
              </li>
            ))}
          </ul>
          <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>AI confidence</span>
            <span className="font-mono text-khaki">{alert.aiScore}%</span>
          </div>
        </div>
      )}

      {alert.status !== "resolved" && (
        <div className="mt-4 flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onAction?.(alert.id, "acknowledge")}
            className="gap-1"
          >
            <CheckCircle2 className="size-3.5" /> Acknowledge
          </Button>
          <Button
            size="sm"
            onClick={() => onAction?.(alert.id, "resolve")}
            className="gap-1 bg-khaki text-khaki-foreground hover:bg-khaki/90"
          >
            Resolve
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onAction?.(alert.id, "escalate")}
            className="gap-1 text-critical hover:text-critical hover:bg-critical/10 ml-auto"
          >
            Escalate <ArrowUpRight className="size-3.5" />
          </Button>
        </div>
      )}
    </article>
  );
});
