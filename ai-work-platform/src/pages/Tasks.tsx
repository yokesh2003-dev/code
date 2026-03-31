import React, { useState, useMemo } from "react";
import { TaskCard } from "@/components/TaskCard";
import { TaskModal } from "@/components/TaskModal";
import { useStore } from "@/lib/store";
import { Task } from "@/lib/types";
import { Search, Filter, Download, LayoutList, LayoutGrid } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Tasks() {
  const { state } = useStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<string>("Deadline soonest");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  const filteredTasks = useMemo(() => {
    return state.tasks.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.owner.toLowerCase().includes(search.toLowerCase());
      const matchPriority = filterPriority === "All" || t.priority === filterPriority;
      const matchStatus = filterStatus === "All" || t.status === filterStatus;
      const matchCategory = filterCategory === "All" || t.category === filterCategory;
      return matchSearch && matchPriority && matchStatus && matchCategory;
    }).sort((a, b) => {
      if (sortOrder === "Urgent First") {
        const priorities: Record<string, number> = { "Urgent": 1, "Important": 2, "Later": 3, "Optional": 4 };
        return (priorities[a.priority] || 9) - (priorities[b.priority] || 9);
      } else if (sortOrder === "Newest First") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        // Sort completed to bottom
        if (a.status === "Completed" && b.status !== "Completed") return 1;
        if (a.status !== "Completed" && b.status === "Completed") return -1;
        // Then by deadline
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
    });
  }, [state.tasks, search, filterPriority, filterStatus, filterCategory, sortOrder]);

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(filteredTasks, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tasks_export.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportText = () => {
    const dataStr = filteredTasks.map(t => 
      `- ${t.title} (Owner: ${t.owner}, Deadline: ${new Date(t.deadline).toLocaleDateString()}, Priority: ${t.priority}, Status: ${t.status})`
    ).join("\n");
    const blob = new Blob([dataStr], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "tasks_export.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">All Tasks</h1>
        
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="relative w-48 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..." 
              className="w-full h-9 pl-9 pr-4 rounded-xl bg-card border border-border focus:border-primary outline-none text-sm shadow-sm"
            />
          </div>
          
          <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className="h-9 px-3 rounded-xl bg-card border border-border text-sm shadow-sm appearance-none cursor-pointer shrink-0">
            <option value="All">Priority</option>
            <option value="Urgent">Urgent</option>
            <option value="Important">Important</option>
            <option value="Later">Later</option>
            <option value="Optional">Optional</option>
          </select>

          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="h-9 px-3 rounded-xl bg-card border border-border text-sm shadow-sm appearance-none cursor-pointer shrink-0">
            <option value="All">Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Expired">Expired</option>
          </select>

          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="h-9 px-3 rounded-xl bg-card border border-border text-sm shadow-sm appearance-none cursor-pointer shrink-0">
            <option value="All">Category</option>
            <option value="Work">Work</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Review">Review</option>
            <option value="Personal">Personal</option>
          </select>

          <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className="h-9 px-3 rounded-xl bg-card border border-border text-sm shadow-sm appearance-none cursor-pointer shrink-0">
            <option value="Deadline soonest">Sort: Deadline</option>
            <option value="Urgent First">Sort: Urgent</option>
            <option value="Newest First">Sort: Newest</option>
          </select>

          <div className="flex bg-card border border-border rounded-xl p-0.5 shrink-0">
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <LayoutList className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 rounded-xl shrink-0 gap-2">
                <Download className="w-4 h-4" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl">
              <DropdownMenuItem onClick={handleExportJSON}>Export as JSON</DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportText}>Export as Text</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-2"}>
        {filteredTasks.map(task => (
          <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} viewMode={viewMode} />
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50 py-12">
          <Filter className="w-12 h-12 mb-4" />
          <p>No tasks match your filters</p>
        </div>
      )}

      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
    </div>
  );
}
