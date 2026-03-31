import React, { useState } from "react";
import { CheckCircle2, Circle, Clock, MessageSquare, Tag } from "lucide-react";
import { Task } from "@/lib/types";
import { cn, getPriorityColor } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { format, isPast } from "date-fns";

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isDraggable?: boolean;
  viewMode?: "grid" | "list";
}

export function TaskCard({ task, onClick, isDraggable, viewMode = "grid" }: TaskCardProps) {
  const { dispatch } = useStore();
  const [isHovered, setIsHovered] = useState(false);

  const toggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus = task.status === "Completed" ? "Pending" : "Completed";
    dispatch({ type: "UPDATE_TASK", payload: { ...task, status: newStatus } });
  };

  const isOverdue = task.status !== "Completed" && task.status !== "Skipped" && isPast(new Date(task.deadline));
  const isCompleted = task.status === "Completed";
  const isSkipped = task.status === "Skipped";

  const statusStyle = isCompleted || isSkipped ? "opacity-60 grayscale-[0.5] border-l-muted hover:grayscale-0 hover:opacity-100" : "border-l-transparent";
  
  if (viewMode === "list") {
    return (
      <div className="relative group/stack" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        {/* Decorative stack layers for hover animation */}
        <div className="absolute inset-0 bg-muted/40 rounded-xl transform transition-transform duration-300 group-hover/stack:translate-y-1 group-hover/stack:scale-[0.98] -z-10"></div>
        <div className="absolute inset-0 bg-muted/20 rounded-xl transform transition-transform duration-300 group-hover/stack:translate-y-2 group-hover/stack:scale-[0.96] -z-20"></div>
        
        <div 
          onClick={onClick}
          className={cn(
            "glass-panel rounded-xl px-4 py-3 transition-all duration-300 group cursor-pointer border-l-4 relative z-10 bg-card",
            "hover:shadow-lg hover:-translate-y-1 hover:border-l-primary flex flex-col justify-center",
            statusStyle,
            isDraggable ? "cursor-grab active:cursor-grabbing" : ""
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button onClick={toggleStatus} className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                {isCompleted ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5" />}
              </button>
              
              <div className="flex-1 min-w-0 flex items-center gap-4">
                <h4 className={cn("text-sm font-bold text-foreground truncate min-w-[120px]", (isCompleted || isSkipped) && "line-through text-muted-foreground")}>
                  {task.title}
                </h4>
                
                <div className="hidden md:flex flex-wrap items-center gap-2 text-xs flex-1">
                  <span className={cn("px-2 py-0.5 rounded-md border font-bold", getPriorityColor(task.priority))}>
                    {task.priority}
                  </span>
                  {task.status === "Skipped" && (
                    <span className="px-2 py-0.5 rounded-md border bg-muted font-bold text-muted-foreground">
                      Skipped
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md border bg-muted/50 border-border font-medium text-muted-foreground">
                    {task.category}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs flex-shrink-0">
              <span className={cn("hidden sm:flex items-center text-muted-foreground w-20 font-medium", isOverdue && !isCompleted && "text-destructive font-bold")}>
                <Clock className="w-3.5 h-3.5 mr-1" />
                {format(new Date(task.deadline), 'MMM d')}
              </span>
              
              <span className="flex items-center text-muted-foreground font-medium bg-muted px-2 py-1 rounded-md w-24 truncate">
                👤 {task.owner}
              </span>
            </div>
          </div>
          
          {/* Hover Reveal Details in List Mode */}
          <div className={cn("overflow-hidden transition-all duration-300", isHovered ? "max-h-20 mt-3 opacity-100" : "max-h-0 opacity-0")}>
             <p className="text-xs text-muted-foreground line-clamp-2 pl-8 border-l border-border/50 ml-2">
               {task.description || "No description provided."}
             </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group/stack h-full" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {/* Decorative stack layers for grid */}
      <div className="absolute inset-0 bg-muted/40 rounded-xl transform transition-transform duration-300 group-hover/stack:translate-y-1 group-hover/stack:scale-[0.98] group-hover/stack:rotate-1 -z-10"></div>
      <div className="absolute inset-0 bg-muted/20 rounded-xl transform transition-transform duration-300 group-hover/stack:translate-y-2 group-hover/stack:scale-[0.96] group-hover/stack:-rotate-1 -z-20"></div>

      <div 
        onClick={onClick}
        className={cn(
          "glass-panel rounded-xl p-4 transition-all duration-300 group cursor-pointer border-l-4 h-full flex flex-col relative z-10 bg-card",
          "hover:shadow-xl hover:-translate-y-1.5 hover:border-l-primary",
          statusStyle,
          isDraggable ? "cursor-grab active:cursor-grabbing" : ""
        )}
      >
        <div className="flex items-start space-x-3 flex-1 min-w-0">
          <button onClick={toggleStatus} className="mt-0.5 text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
            {isCompleted ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Circle className="w-5 h-5" />}
          </button>
          
          <div className="flex-1 min-w-0 flex flex-col h-full">
            <h4 className={cn("text-sm font-bold text-foreground line-clamp-2 leading-tight", (isCompleted || isSkipped) && "line-through text-muted-foreground")}>
              {task.title}
            </h4>
            
            <p className={cn("text-xs text-muted-foreground mt-2 flex-1 transition-all", isHovered ? "line-clamp-none" : "line-clamp-2")}>
              {task.description || "No description provided."}
            </p>
            
            <div className="flex flex-wrap items-center gap-2 mt-4 text-[10px] sm:text-xs">
              <span className={cn("px-2 py-0.5 rounded-md border font-bold", getPriorityColor(task.priority))}>
                {task.priority}
              </span>
              
              {task.status === "Skipped" && (
                <span className="px-2 py-0.5 rounded-md border bg-muted font-bold text-muted-foreground">
                  Skipped
                </span>
              )}
              
              <span className={cn("flex items-center font-medium text-muted-foreground", isOverdue && !isCompleted && "text-destructive font-bold")}>
                <Clock className="w-3.5 h-3.5 mr-1" />
                {format(new Date(task.deadline), 'MMM d')}
              </span>
              
              <span className="flex items-center text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded-md">
                👤 {task.owner}
              </span>
              
              {task.comments.length > 0 && (
                <span className="flex items-center text-muted-foreground font-medium">
                  <MessageSquare className="w-3.5 h-3.5 mr-1" />
                  {task.comments.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
