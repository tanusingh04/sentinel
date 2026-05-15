import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "operator" | "engineer";
export type Theme = "dark" | "light";

interface Ctx {
  role: Role;
  setRole: (r: Role) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const DashboardContext = createContext<Ctx | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>("operator");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const r = (localStorage.getItem("sad-role") as Role) || "operator";
    const t = (localStorage.getItem("sad-theme") as Theme) || "dark";
    setRoleState(r);
    setTheme(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("sad-theme", theme);
  }, [theme]);

  const setRole = (r: Role) => {
    setRoleState(r);
    localStorage.setItem("sad-role", r);
  };

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <DashboardContext.Provider value={{ role, setRole, theme, toggleTheme }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used inside DashboardProvider");
  return ctx;
}
