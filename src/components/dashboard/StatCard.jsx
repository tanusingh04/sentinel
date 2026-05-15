import { cn } from "@/lib/utils";

const tones = {
  default: "bg-card border-border",
  khaki: "bg-khaki text-khaki-foreground border-khaki",
  critical: "bg-critical/10 border-critical/30 text-foreground",
  success: "bg-success/10 border-success/30 text-foreground",
};

export function StatCard({ label, value, delta, icon: Icon, tone = "default" }) {
  return (
    <div className={cn("rounded-2xl border p-5 transition-all hover:shadow-elevated", tones[tone])}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider opacity-70">{label}</span>
        <Icon className="size-4 opacity-70" />
      </div>
      <div className="mt-3 text-3xl font-display font-semibold tabular-nums">{value}</div>
      {delta && <div className="mt-1 text-xs opacity-70">{delta}</div>}
    </div>
  );
}
