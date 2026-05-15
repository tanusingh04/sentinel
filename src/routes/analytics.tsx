import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout/Shell";
import { ALERT_TREND, PERF_METRICS, SYSTEM_HEALTH } from "@/lib/mock-alerts";
import { ChartCard, tooltipStyle } from "./index";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Sentinel" },
      { name: "description", content: "Real-time analytics, trends, and system performance." },
    ],
  }),
  component: () => (
    <Shell>
      <AnalyticsPage />
    </Shell>
  ),
});

function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-display font-semibold">Analytics</h1>
        <p className="text-muted-foreground mt-1">Trend lines, system health, and engineering metrics.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Alert volume by priority · 24h">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={ALERT_TREND}>
              <defs>
                <linearGradient id="ac" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--critical)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--critical)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="am" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--khaki)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--khaki)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="hour" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="critical" stroke="var(--critical)" fill="url(#ac)" strokeWidth={2} />
              <Area type="monotone" dataKey="medium" stroke="var(--khaki)" fill="url(#am)" strokeWidth={2} />
              <Area type="monotone" dataKey="low" stroke="var(--info)" fill="transparent" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="System health %">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={SYSTEM_HEALTH}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="system" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="health" fill="var(--khaki)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Performance metrics · 24h">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={PERF_METRICS}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="t" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="cpu" stroke="var(--khaki)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="load" stroke="var(--info)" dot={false} strokeWidth={2} />
              <Line type="monotone" dataKey="temp" stroke="var(--critical)" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Mean time to resolve">
          <div className="grid grid-cols-3 gap-4 py-6">
            {[
              { label: "Critical", value: "08m", tone: "text-critical" },
              { label: "Medium", value: "21m", tone: "text-khaki" },
              { label: "Low", value: "1.4h", tone: "text-info" },
            ].map((m) => (
              <div key={m.label} className="text-center rounded-xl bg-surface/40 border border-border p-4">
                <div className={`text-3xl font-display font-semibold ${m.tone}`}>{m.value}</div>
                <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{m.label}</div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
