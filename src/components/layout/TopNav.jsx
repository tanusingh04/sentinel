import { Search, Sun, Moon, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDashboard } from "@/lib/dashboard-context";
import { Link } from "@tanstack/react-router";

export function TopNav() {
  const { role, setRole, theme, toggleTheme } = useDashboard();
  return (
    <header className="h-16 shrink-0 border-b border-border bg-background/70 backdrop-blur-md sticky top-0 z-30">
      <div className="h-full px-4 md:px-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search alerts, devices, systems…"
            className="pl-9 bg-surface/60 border-border h-10"
          />
        </div>

        <div className="hidden sm:flex items-center rounded-lg bg-surface/60 border border-border p-1">
          {["operator", "engineer"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={
                "px-3 py-1.5 text-xs rounded-md font-medium capitalize transition-all " +
                (role === r
                  ? "bg-khaki text-khaki-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground")
              }
            >
              {r}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="text-foreground hover:bg-surface"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>

        <Link
          to="/notifications"
          className="relative size-10 rounded-md inline-flex items-center justify-center hover:bg-surface text-foreground"
        >
          <Bell className="size-4" />
          <span className="absolute top-2 right-2 size-2 rounded-full bg-critical pulse-dot" />
        </Link>

        <div className="hidden md:flex items-center gap-3 pl-3 border-l border-border">
          <div className="text-right leading-tight">
            <div className="text-sm font-medium">A. Mercer</div>
            <div className="text-xs text-muted-foreground capitalize">{role}</div>
          </div>
          <div className="size-9 rounded-full bg-khaki text-khaki-foreground flex items-center justify-center font-semibold">
            AM
          </div>
        </div>
      </div>
    </header>
  );
}
