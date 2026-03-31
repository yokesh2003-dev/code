import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { StoreProvider, useStore } from "@/lib/store";
import { Layout } from "@/components/layout/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Tasks } from "@/pages/Tasks";
import { Board } from "@/pages/Board";
import { Analytics } from "@/pages/Analytics";
import { Drive } from "@/pages/Drive";
import { History } from "@/pages/History";
import { Settings } from "@/pages/Settings";
import { Notes } from "@/pages/Notes";
import { isToday, isPast } from "date-fns";
import { X } from "lucide-react";

const queryClient = new QueryClient();

function ToastContainer() {
  const { state } = useStore();
  const [toasts, setToasts] = useState<{id: string, message: string, type: 'warning' | 'info'}[]>([]);

  useEffect(() => {
    let newToasts: {id: string, message: string, type: 'warning' | 'info'}[] = [];
    
    // Check for expired tasks
    const expiredTasks = state.tasks.filter(t => t.status === "Expired").slice(0, 3);
    expiredTasks.forEach(t => {
      newToasts.push({ id: `exp-${t.id}`, message: `⚠️ ${t.title} is overdue`, type: 'warning' });
    });

    // Check for due today
    const dueToday = state.tasks.filter(t => t.status !== "Completed" && t.status !== "Expired" && isToday(new Date(t.deadline)));
    dueToday.forEach(t => {
      newToasts.push({ id: `due-${t.id}`, message: `🔔 ${t.title} is due today`, type: 'info' });
    });

    setToasts(newToasts);

    const timer = setTimeout(() => {
      setToasts([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [state.tasks]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed z-50 top-4 right-4 flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto flex items-start gap-3 min-w-64 animate-in slide-in-from-right rounded-xl bg-card border border-border shadow-lg px-4 py-3">
          <p className="text-sm font-medium text-foreground flex-1">{toast.message}</p>
          <button onClick={() => setToasts(t => t.filter(x => x.id !== toast.id))} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/tasks" component={Tasks} />
        <Route path="/board" component={Board} />
        <Route path="/notes" component={Notes} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/drive" component={Drive} />
        <Route path="/history" component={History} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
            <ToastContainer />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
