import React, { useState } from "react";
import { AiTaskInput } from "@/components/AiTaskInput";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { useStore } from "@/lib/store";
import { Task } from "@/lib/types";
import { AlertCircle, Clock, MessageSquareWarning } from "lucide-react";

export function Dashboard() {
  const { state } = useStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const myTasks = state.tasks.filter(t => t.owner === state.currentUser && t.status !== "Completed");
  const teamTasks = state.tasks.filter(t => t.owner !== state.currentUser && t.status !== "Completed");

  const urgentCount = myTasks.filter(t => t.priority === "Urgent").length;
  const overdueCount = myTasks.filter(t => t.status === "Expired").length;
  const followUpCount = myTasks.filter(t => t.category === "Follow-up" && t.status === "Pending").length;

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-foreground mb-2">Good morning, {state.currentUser}.</h1>
        <p className="text-muted-foreground">
          You have <strong className="text-foreground">{myTasks.length} pending tasks</strong> today.
        </p>
      </header>

      {(urgentCount > 0 || overdueCount > 0 || followUpCount > 0) && (
        <div className="flex flex-wrap gap-3 mb-8">
          {urgentCount > 0 && (
            <div className="flex items-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1.5 rounded-full text-sm font-medium">
              <AlertCircle className="w-4 h-4" />
              <span>{urgentCount} urgent task{urgentCount > 1 ? 's' : ''} need attention</span>
            </div>
          )}
          {overdueCount > 0 && (
            <div className="flex items-center gap-2 bg-orange-500/10 text-orange-500 border border-orange-500/20 px-3 py-1.5 rounded-full text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>{overdueCount} task{overdueCount > 1 ? 's' : ''} overdue</span>
            </div>
          )}
          {followUpCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-500/10 text-blue-500 border border-blue-500/20 px-3 py-1.5 rounded-full text-sm font-medium">
              <MessageSquareWarning className="w-4 h-4" />
              <span>{followUpCount} follow-up{followUpCount > 1 ? 's' : ''} pending</span>
            </div>
          )}
        </div>
      )}

      <AiTaskInput />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - My Tasks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">My Focus</h2>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{myTasks.length} tasks</span>
          </div>
          <div className="space-y-3">
            {myTasks.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl text-muted-foreground">
                All caught up! Grab a coffee ☕
              </div>
            ) : (
              myTasks
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .map(task => (
                  <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                ))
            )}
          </div>
        </section>

        {/* Right Column - Team Tasks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Team Activity</h2>
            <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold">{teamTasks.length} tasks</span>
          </div>
          <div className="space-y-3">
             {teamTasks.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-border rounded-2xl text-muted-foreground">
                No active team tasks.
              </div>
            ) : (
              teamTasks
                .slice(0, 5) // just show top 5 on dashboard
                .map(task => (
                  <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                ))
            )}
          </div>
        </section>
      </div>

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
