import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  CheckSquare, 
  KanbanSquare, 
  BarChart2, 
  HardDrive, 
  History, 
  Settings,
  Sparkles,
  ChevronDown,
  Plus,
  FileText
} from "lucide-react";
import { cn, generateId } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Board", href: "/board", icon: KanbanSquare },
  { name: "Notes", href: "/notes", icon: FileText, urgent: false },
  { name: "Analytics", href: "/analytics", icon: BarChart2 },
  { name: "Drive", href: "/drive", icon: HardDrive },
  { name: "History", href: "/history", icon: History },
];

export function Sidebar() {
  const [location] = useLocation();
  const { state, dispatch } = useStore();

  const handleCreateWorkspace = () => {
    const name = prompt("Enter new workspace name:");
    if (name && name.trim()) {
      const newWs = {
        id: generateId(),
        name: name.trim(),
        members: [{ id: generateId(), name: state.currentUser, email: "", role: "Admin" as const }]
      };
      dispatch({ type: "ADD_WORKSPACE", payload: newWs });
      dispatch({ type: "SWITCH_WORKSPACE", payload: newWs.id });
    }
  };

  const workspaces = state.workspaces || [];
  const activeWorkspaceId = state.activeWorkspaceId || "workspace-1";
  const urgentTasksCount = (state.tasks || []).filter(t => t.priority === "Urgent" && t.status !== "Completed").length;

  return (
    <aside className="w-64 flex-shrink-0 bg-sidebar border-r border-sidebar-border h-screen flex flex-col transition-all duration-300 hidden md:flex">
      {/* Logo & Workspace Switcher */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center w-full cursor-pointer hover:bg-sidebar-border/30 p-2 rounded-xl transition-colors">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20 mr-3 flex-shrink-0">
                {state.workspace?.branding?.logo ? (
                  <img src={state.workspace.branding.logo} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                ) : (
                  <Sparkles className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-bold text-sidebar-foreground leading-tight tracking-tight truncate">AI Work OS</span>
                <span className="text-xs text-sidebar-foreground/60 leading-tight truncate">{state.workspace?.name}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-sidebar-foreground/50 flex-shrink-0" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 rounded-xl glass-panel border-white/10 p-2">
            <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5 uppercase">Workspaces</div>
            {workspaces.map(ws => (
              <DropdownMenuItem 
                key={ws.id} 
                onClick={() => dispatch({ type: "SWITCH_WORKSPACE", payload: ws.id })}
                className={cn("rounded-lg px-2 py-2 cursor-pointer mb-1", activeWorkspaceId === ws.id ? "bg-primary/20 text-primary" : "")}
              >
                <div className="flex flex-col">
                  <span className="font-semibold">{ws.name}</span>
                  <span className="text-xs opacity-70">{ws.members?.length || 0} members</span>
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator className="bg-border my-1" />
            <DropdownMenuItem onClick={handleCreateWorkspace} className="rounded-lg px-2 py-2 cursor-pointer text-primary">
              <Plus className="w-4 h-4 mr-2" /> New Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Nav Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <div className="text-xs font-semibold text-sidebar-foreground/40 uppercase tracking-wider mb-4 px-3">Menu</div>
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href} className="block">
              <div className={cn(
                "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-sidebar-foreground/70 hover:bg-sidebar-border/50 hover:text-sidebar-foreground"
              )}>
                <item.icon className={cn(
                  "w-5 h-5 mr-3 transition-colors",
                  isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                )} />
                {item.name}
                
                {item.name === "Tasks" && urgentTasksCount > 0 && (
                  <span className="absolute right-3 w-5 h-5 flex items-center justify-center bg-urgent text-white text-[10px] font-bold rounded-full">
                    {urgentTasksCount}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Settings */}
      <div className="p-4 border-t border-sidebar-border">
        <Link href="/settings" className="block">
          <div className={cn(
            "flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
            location === "/settings"
              ? "bg-primary/10 text-primary" 
              : "text-sidebar-foreground/70 hover:bg-sidebar-border/50 hover:text-sidebar-foreground"
          )}>
            <Settings className="w-5 h-5 mr-3 text-sidebar-foreground/50 group-hover:text-sidebar-foreground" />
            Settings
          </div>
        </Link>
      </div>
    </aside>
  );
}
