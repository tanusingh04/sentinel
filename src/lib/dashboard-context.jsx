import { createContext, useContext, useEffect, useState } from "react";

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const [role, setRoleState] = useState("operator");
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const r = localStorage.getItem("sad-role") || "operator";
    const t = localStorage.getItem("sad-theme") || "dark";
    setRoleState(r);
    setTheme(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("dark", "light");
    document.documentElement.classList.add(theme);
    localStorage.setItem("sad-theme", theme);
  }, [theme]);

  const setRole = (r) => {
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
