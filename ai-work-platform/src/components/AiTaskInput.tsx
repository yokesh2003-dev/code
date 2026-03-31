import React, { useState } from "react";
import { Sparkles, Trash } from "lucide-react";
import { parseTextToTasks } from "@/lib/ai-parser";
import { useStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

export function AiTaskInput() {
  const [text, setText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { state, dispatch } = useStore();

  const handleGenerate = () => {
    if (!text.trim()) return;
    setIsProcessing(true);
    
    // Simulate AI delay
    setTimeout(() => {
      const tasks = parseTextToTasks(text, state.currentUser, state.workspace.id);
      tasks.forEach(t => dispatch({ type: "ADD_TASK", payload: t }));
      
      if (tasks.length > 0) {
        dispatch({ 
          type: "ADD_ACTIVITY", 
          payload: { id: generateId(), action: "AI Batch Generation", details: `Created ${tasks.length} tasks from notes`, timestamp: new Date().toISOString(), user: state.currentUser }
        });
      }
      
      setText("");
      setIsProcessing(false);
    }, 1000);
  };

  return (
    <div className="glass-panel p-1 rounded-2xl mb-8 relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent opacity-20 rounded-2xl blur group-hover:opacity-30 transition duration-500"></div>
      <div className="relative bg-card rounded-[14px] p-4 flex flex-col">
        <textarea 
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste meeting notes, emails, or random thoughts... I'll organize them into tasks."
          className="w-full bg-transparent resize-none h-20 outline-none text-foreground placeholder:text-muted-foreground/60 p-2"
        />
        <div className="flex justify-between items-center mt-2 border-t border-border/50 pt-3">
          <div className="text-xs text-muted-foreground flex items-center">
            <Sparkles className="w-3 h-3 mr-1 text-primary" /> Natural Language Processing active
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => setText("")}
              disabled={!text}
              className="p-2 text-muted-foreground hover:bg-muted rounded-xl transition-colors disabled:opacity-30"
            >
              <Trash className="w-4 h-4" />
            </button>
            <button 
              onClick={handleGenerate}
              disabled={!text || isProcessing}
              className="flex items-center px-5 py-2 bg-gradient-to-r from-primary to-accent text-white font-medium text-sm rounded-xl shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:transform-none"
            >
              {isProcessing ? "Processing..." : "Generate Tasks"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
