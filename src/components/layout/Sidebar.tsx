import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  AlertTriangle,
  BarChart3,
  Users,
  Settings,
  Bell,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/roles", label: "Role Management", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="size-9 rounded-xl bg-khaki flex items-center justify-center text-khaki-foreground">
          <ShieldCheck className="size-5" />
        </div>
        <div>
          <div className="font-display text-lg font-semibold leading-none">Sentinel</div>
          <div className="text-xs text-sidebar-foreground/60 mt-1">Smart Alert OS</div>
        </div>
      </div>

      <nav className="px-3 mt-2 flex-1 space-y-1">
        {items.map((it) => {
          const active = it.to === "/" ? path === "/" : path.startsWith(it.to);
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                active
                  ? "bg-khaki text-khaki-foreground font-medium shadow-glow"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-4" />
              <span>{it.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 p-4 rounded-xl bg-sidebar-accent/60 border border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">AI Engine</div>
        <div className="mt-1 text-sm font-medium flex items-center gap-2">
          <span className="size-2 rounded-full bg-success" />
          Online · prioritizing
        </div>
      </div>
    </aside>
  );
}
