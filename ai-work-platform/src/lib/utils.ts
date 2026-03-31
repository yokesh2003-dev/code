import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDays, subDays, isBefore, startOfDay, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Initial Mock Data
export const initialTasks = [
  {
    id: generateId(),
    title: "Send Q1 Report",
    description: "Prepare and send Q1 performance report to leadership",
    owner: "Ravi",
    assignedBy: "You",
    deadline: addDays(new Date(), 4).toISOString(),
    priority: "Urgent" as const,
    category: "Work" as const,
    effort: "High" as const,
    status: "Pending" as const,
    workspaceId: "workspace-1",
    comments: [],
    ccList: ["manager@company.com"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Review Design Mockups",
    description: "Check new dashboard UI designs and provide feedback",
    owner: "You",
    assignedBy: "Anita",
    deadline: addDays(new Date(), 1).toISOString(),
    priority: "Important" as const,
    category: "Review" as const,
    effort: "Medium" as const,
    status: "Pending" as const,
    workspaceId: "workspace-1",
    comments: [],
    ccList: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Follow up with Client",
    description: "Call client regarding onboarding issues",
    owner: "You",
    assignedBy: "You",
    deadline: addDays(new Date(), 7).toISOString(),
    priority: "Important" as const,
    category: "Follow-up" as const,
    effort: "Low" as const,
    status: "Pending" as const,
    workspaceId: "workspace-1",
    comments: [],
    ccList: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Update Documentation",
    description: "Update internal docs for new feature release",
    owner: "Priya",
    assignedBy: "You",
    deadline: addDays(new Date(), 3).toISOString(),
    priority: "Later" as const,
    category: "Work" as const,
    effort: "Medium" as const,
    status: "Pending" as const,
    workspaceId: "workspace-1",
    comments: [],
    ccList: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    title: "Team Meeting Summary",
    description: "Summarize last sprint meeting notes",
    owner: "You",
    assignedBy: "You",
    deadline: startOfDay(new Date()).toISOString(),
    priority: "Urgent" as const,
    category: "Work" as const,
    effort: "Low" as const,
    status: "Completed" as const,
    workspaceId: "workspace-1",
    comments: [],
    ccList: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "Urgent": return "text-urgent bg-urgent/10 border-urgent/20";
    case "Important": return "text-important bg-important/10 border-important/20";
    case "Later": return "text-later bg-later/10 border-later/20";
    case "Optional": return "text-optional bg-optional/10 border-optional/20";
    default: return "text-muted-foreground bg-muted border-border";
  }
};

export const getPriorityHex = (priority: string) => {
  switch (priority) {
    case "Urgent": return "#ef4444";
    case "Important": return "#f97316";
    case "Later": return "#6b7280";
    case "Optional": return "#3b82f6";
    default: return "#888888";
  }
};
