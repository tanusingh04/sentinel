import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { DashboardProvider } from "@/lib/dashboard-context";

export function Shell({ children }) {
  return (
    <DashboardProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNav />
          <main className="flex-1 grid-pattern">
            <div className="p-4 md:p-8 max-w-[1500px] mx-auto animate-in-up">{children}</div>
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
