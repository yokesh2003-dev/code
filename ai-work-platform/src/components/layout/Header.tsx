import React from "react";
import { Search, Bell, Sun, Moon, Plus } from "lucide-react";
import { useStore } from "@/lib/store";

export function Header() {
  const { state, dispatch } = useStore();

  const toggleTheme = () => {
    dispatch({ type: "SET_THEME", payload: state.theme === "dark" ? "light" : "dark" });
  };

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search tasks, docs, people..." 
            className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/50 border border-transparent focus:border-primary/30 focus:bg-background focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        <button className="hidden sm:flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4 mr-1.5" />
          New
        </button>

        <div className="w-px h-6 bg-border mx-2 hidden sm:block"></div>

        <button onClick={toggleTheme} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          {state.theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="w-10 h-10 relative flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-white font-bold text-sm shadow-md cursor-pointer hover:scale-105 transition-transform ml-2">
          {state.currentUser.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
