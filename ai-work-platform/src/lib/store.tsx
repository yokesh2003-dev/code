import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AppState, Task, Activity, Workspace, Note, WorkspaceMember } from "./types";
import { initialTasks, generateId } from "./utils";
import { isBefore, startOfDay } from "date-fns";

type Action =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload: Task }
  | { type: "DELETE_TASK"; payload: string }
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "UPDATE_WORKSPACE"; payload: Partial<Workspace> }
  | { type: "ADD_WORKSPACE"; payload: Workspace }
  | { type: "SWITCH_WORKSPACE"; payload: string }
  | { type: "UPDATE_WORKSPACE_MEMBERS"; payload: { workspaceId: string, members: WorkspaceMember[] } }
  | { type: "ADD_NOTE"; payload: Note }
  | { type: "UPDATE_NOTE"; payload: Note }
  | { type: "DELETE_NOTE"; payload: string }
  | { type: "ADD_ACTIVITY"; payload: Activity }
  | { type: "UPDATE_USER"; payload: string }
  | { type: "REFRESH_STATUSES" };

const defaultWorkspaces: Workspace[] = [
  { 
    id: "workspace-1", 
    name: "Product Team", 
    supportEmail: "support@company.com", 
    members: [
      { id: "m1", name: "You", email: "you@co.com", role: "Admin" }, 
      { id: "m2", name: "Ravi", email: "ravi@co.com", role: "Editor" }, 
      { id: "m3", name: "Priya", email: "priya@co.com", role: "Viewer" }
    ], 
    branding: {} 
  },
  { 
    id: "workspace-2", 
    name: "Design Team", 
    supportEmail: "design@company.com", 
    members: [
      { id: "m1", name: "You", email: "you@co.com", role: "Admin" }
    ], 
    branding: {} 
  }
];

const initialState: AppState = {
  workspace: defaultWorkspaces[0],
  workspaces: defaultWorkspaces,
  activeWorkspaceId: "workspace-1",
  notes: [],
  tasks: initialTasks,
  history: [
    { id: "h1", action: "Workspace Created", details: "Product Team initialized", timestamp: new Date().toISOString(), user: "System" }
  ],
  theme: "dark",
  currentUser: "You",
};

const StoreContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD_TASK":
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? action.payload : t)),
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "UPDATE_WORKSPACE":
      const updatedWorkspaces = state.workspaces.map(w => w.id === state.activeWorkspaceId ? { ...w, ...action.payload } : w);
      return { 
        ...state, 
        workspace: { ...state.workspace, ...action.payload },
        workspaces: updatedWorkspaces
      };
    case "ADD_WORKSPACE":
      return {
        ...state,
        workspaces: [...state.workspaces, action.payload]
      };
    case "SWITCH_WORKSPACE":
      const activeW = state.workspaces.find(w => w.id === action.payload) || state.workspaces[0];
      return {
        ...state,
        activeWorkspaceId: action.payload,
        workspace: activeW
      };
    case "UPDATE_WORKSPACE_MEMBERS":
      return {
        ...state,
        workspaces: state.workspaces.map(w => w.id === action.payload.workspaceId ? { ...w, members: action.payload.members } : w),
        workspace: state.activeWorkspaceId === action.payload.workspaceId ? { ...state.workspace, members: action.payload.members } : state.workspace
      };
    case "ADD_NOTE":
      return { ...state, notes: [action.payload, ...state.notes] };
    case "UPDATE_NOTE":
      return { ...state, notes: state.notes.map(n => n.id === action.payload.id ? action.payload : n) };
    case "DELETE_NOTE":
      return { ...state, notes: state.notes.filter(n => n.id !== action.payload) };
    case "ADD_ACTIVITY":
      return { ...state, history: [action.payload, ...state.history] };
    case "UPDATE_USER":
      return { ...state, currentUser: action.payload };
    case "REFRESH_STATUSES":
      const now = startOfDay(new Date());
      let modified = false;
      const updatedTasks = state.tasks.map(t => {
        if (t.status !== "Completed" && t.status !== "Expired" && t.status !== "Skipped") {
          if (isBefore(new Date(t.deadline), now)) {
            modified = true;
            return { ...t, status: "Expired" as const };
          }
        }
        return t;
      });
      return modified ? { ...state, tasks: updatedTasks } : state;
    default:
      return state;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    try {
      const stored = localStorage.getItem("ai-work-platform-state");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.version === "v4" && Array.isArray(parsed.workspaces) && parsed.workspaces.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load state", e);
    }
    return { ...initial, version: "v4" };
  });

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem("ai-work-platform-state", JSON.stringify({ ...state, version: "v4" }));
  }, [state]);

  // Apply theme
  useEffect(() => {
    if (state.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Apply branding colors if present
    const branding = state.workspace?.branding;
    if (branding?.primaryColor) {
      document.documentElement.style.setProperty('--primary', branding.primaryColor);
    } else {
      document.documentElement.style.removeProperty('--primary');
    }
  }, [state.theme, state.workspace]);

  // Periodic status check
  useEffect(() => {
    dispatch({ type: "REFRESH_STATUSES" });
    const interval = setInterval(() => dispatch({ type: "REFRESH_STATUSES" }), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
