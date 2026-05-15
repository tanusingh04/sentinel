import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useCallback, memo } from "react";
import { Shell } from "@/components/layout/Shell";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { useDashboard } from "@/lib/dashboard-context";
import { ALERTS, ALERT_TREND, PERF_METRICS, SYSTEM_HEALTH, sortByPriority } from "@/lib/mock-alerts";
import { Activity, AlertOctagon, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sentinel — Smart Alert Dashboard" },
      { name: "description", content: "AI-prioritized industrial alert dashboard with real-time monitoring." },
      { property: "og:title", content: "Sentinel — Smart Alert Dashboard" },
      { property: "og:description", content: "AI-prioritized industrial alert dashboard." },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <DashboardHome />
    </Shell>
  );
}

function DashboardHome() {
  const { role } = useDashboard();
  const [alerts, setAlerts] = useState(ALERTS);

  const sorted = useMemo(() => sortByPriority(alerts), [alerts]);
  const active = sorted.filter((a) => a.status !== "resolved");
  const critical = active.filter((a) => a.priority === "critical");
  const resolvedToday = alerts.filter((a) => a.status === "resolved").length;

  const handleAction = useCallback((id: string, action: "acknowledge" | "resolve" | "escalate") => {
    setAlerts((cur) =>
      cur.map((a) =>
        a.id === id
          ? {
              ...a,
              status:
                action === "resolve" ? "resolved" : action === "acknowledge" ? "in_progress" : a.status,
              priority: action === "escalate" ? "critical" : a.priority,
            }
          : a,
      ),
    );
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <section className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-khaki font-medium">
            {role} workspace
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-semibold mt-2">
            Operations overview
          </h1>
          <p className="text-muted-foreground mt-1 max-w-xl">
            Smart prioritization surfaces what matters now. {critical.length} critical signal{critical.length === 1 ? "" : "s"} need attention.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-khaki/40 bg-khaki/10 px-4 py-2">
          <Sparkles className="size-4 text-khaki" />
          <span className="text-sm">
            <span className="text-khaki font-semibold">AI</span> reordered{" "}
            <span className="font-mono">{active.length}</span> active alerts
          </span>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Critical" value={critical.length} icon={AlertOctagon} tone="critical" delta="↑ 1 in last 10m" />
        <StatCard label="Active alerts" value={active.length} icon={Activity} tone="khaki" delta="across 5 systems" />
        <StatCard label="Resolved today" value={resolvedToday} icon={CheckCircle2} tone="success" delta="MTTR 14m" />
        <StatCard label="Avg AI confidence" value="84%" icon={TrendingUp} delta="last 24h" />
      </section>

      {/* Main grid */}
      <section className="grid gap-6 lg:grid-cols-3">
        {/* Alerts column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-display font-semibold">Prioritized alerts</h2>
            <span className="text-xs text-muted-foreground">Sorted by AI severity</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {sorted.slice(0, 6).map((a) => (
              <AlertCard key={a.id} alert={a} variant={role} onAction={handleAction} />
            ))}
          </div>
        </div>

        {/* Side panels */}
        <div className="space-y-4">
          <ChartCard title="Alert trend · 24h">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={ALERT_TREND}>
                <defs>
                  <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--khaki)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--khaki)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={24} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="critical" stroke="var(--critical)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="medium" stroke="var(--khaki)" fill="transparent" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="System health">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={SYSTEM_HEALTH} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis type="category" dataKey="system" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="health" fill="var(--khaki)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {role === "engineer" && (
            <ChartCard title="Performance · CPU / Load / Temp">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={PERF_METRICS}>
                  <CartesianGrid stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} width={24} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="cpu" stroke="var(--khaki)" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="load" stroke="var(--info)" dot={false} strokeWidth={2} />
                  <Line type="monotone" dataKey="temp" stroke="var(--critical)" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      </section>
    </div>
  );
}

export const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  color: "var(--popover-foreground)",
};

export const ChartCard = memo(function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{title}</div>
      {children}
    </div>
  );
});
