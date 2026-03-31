export type Priority = "Urgent" | "Important" | "Later" | "Optional";
export type Status = "Pending" | "In Progress" | "Completed" | "Expired" | "Skipped";
export type Category = "Work" | "Follow-up" | "Review" | "Personal";
export type Effort = "Low" | "Medium" | "High";

export interface Comment {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Editor" | "Viewer";
  avatar?: string;
}

export interface WorkspaceBranding {
  primaryColor?: string;
  logo?: string;
}

export interface Workspace {
  id: string;
  name: string;
  supportEmail?: string;
  members?: WorkspaceMember[];
  branding?: WorkspaceBranding;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  workspaceId: string;
}

export interface ActivityLogEntry {
  action: string;
  timestamp: string;
  user: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  owner: string;
  assignedBy: string;
  deadline: string; // ISO date string
  priority: Priority;
  category: Category;
  effort: Effort;
  status: Status;
  workspaceId: string;
  comments: Comment[];
  ccList: string[];
  sharedWith?: string[];
  activityLog?: ActivityLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  taskId?: string;
  action: string;
  details: string;
  timestamp: string;
  user: string;
}

export interface AppState {
  workspace: Workspace; // derived or active
  workspaces: Workspace[];
  activeWorkspaceId: string;
  notes: Note[];
  tasks: Task[];
  history: Activity[];
  theme: "light" | "dark";
  currentUser: string;
}
