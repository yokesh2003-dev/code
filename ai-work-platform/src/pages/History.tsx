import React from "react";
import { useStore } from "@/lib/store";
import { format } from "date-fns";
import { Activity as ActivityIcon } from "lucide-react";

export function History() {
  const { state } = useStore();

  return (
    <div className="animate-in fade-in max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Activity History</h1>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {state.history.map((item, index) => (
          <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-card shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              <ActivityIcon className="w-4 h-4 text-primary" />
            </div>
            
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-foreground">{item.action}</span>
                <time className="text-xs font-medium text-primary">{format(new Date(item.timestamp), 'MMM d, h:mm a')}</time>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.details}
              </div>
              <div className="text-xs mt-2 font-medium bg-muted inline-block px-2 py-0.5 rounded-md">
                👤 {item.user}
              </div>
            </div>
          </div>
        ))}

        {state.history.length === 0 && (
          <div className="text-center text-muted-foreground pt-10">No activity yet.</div>
        )}
      </div>
    </div>
  );
}
