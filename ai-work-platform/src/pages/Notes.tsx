import React from "react";
import { FileText, Plus, Trash2, ArrowRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { generateId } from "@/lib/utils";
import { parseTextToTasks } from "@/lib/ai-parser";
import { useLocation } from "wouter";

export function Notes() {
  const { state, dispatch } = useStore();
  const [, setLocation] = useLocation();

  const workspaceNotes = state.notes.filter(n => n.workspaceId === state.activeWorkspaceId);

  const handleAddNote = () => {
    dispatch({
      type: "ADD_NOTE",
      payload: {
        id: generateId(),
        title: "",
        content: "",
        workspaceId: state.activeWorkspaceId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    });
  };

  const updateNote = (id: string, updates: Partial<typeof workspaceNotes[0]>) => {
    const note = state.notes.find(n => n.id === id);
    if (note) {
      dispatch({ type: "UPDATE_NOTE", payload: { ...note, ...updates, updatedAt: new Date().toISOString() } });
    }
  };

  const handleDelete = (id: string) => {
    dispatch({ type: "DELETE_NOTE", payload: id });
  };

  const handleConvertToTasks = (note: typeof workspaceNotes[0]) => {
    if (!note.content.trim()) return;
    const tasks = parseTextToTasks(note.content, state.currentUser, state.activeWorkspaceId);
    tasks.forEach(t => dispatch({ type: "ADD_TASK", payload: t }));
    
    dispatch({ 
      type: "ADD_ACTIVITY", 
      payload: { id: generateId(), action: "Notes to Tasks", details: `Converted "${note.title || 'Untitled'}" to ${tasks.length} tasks`, timestamp: new Date().toISOString(), user: state.currentUser }
    });

    setLocation("/tasks");
  };

  return (
    <div className="animate-in fade-in flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <FileText className="w-8 h-8 mr-3 text-primary" />
          Quick Notes
        </h1>
        <button onClick={handleAddNote} className="flex items-center px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all">
          <Plus className="w-4 h-4 mr-2" /> New Note
        </button>
      </div>

      {workspaceNotes.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center opacity-70">
          <div className="w-24 h-24 mb-6 rounded-3xl bg-primary/10 flex items-center justify-center">
            <FileText className="w-12 h-12 text-primary" />
          </div>
          <p className="text-xl font-semibold mb-2">No notes yet</p>
          <p className="text-muted-foreground mb-6">Create a quick note to capture thoughts or generate tasks.</p>
          <button onClick={handleAddNote} className="px-6 py-2 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors">
            Create your first note
          </button>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 pb-12">
          {workspaceNotes.map(note => (
            <div key={note.id} className="break-inside-avoid">
              <div className="glass-panel p-5 rounded-2xl flex flex-col group relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(note.id)} className="p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <input
                  value={note.title}
                  onChange={e => updateNote(note.id, { title: e.target.value })}
                  placeholder="Note Title..."
                  className="bg-transparent border-none text-lg font-bold outline-none mb-3 pr-10 placeholder:text-muted-foreground/50 focus:ring-0 w-full"
                />
                
                <textarea
                  value={note.content}
                  onChange={e => updateNote(note.id, { content: e.target.value })}
                  placeholder="Start typing your thoughts..."
                  className="bg-transparent border-none outline-none resize-none min-h-[120px] mb-4 text-sm leading-relaxed placeholder:text-muted-foreground/50 focus:ring-0 w-full flex-1"
                />
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </span>
                  
                  <button 
                    onClick={() => handleConvertToTasks(note)}
                    disabled={!note.content.trim()}
                    className="flex items-center px-3 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-lg hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Convert to Tasks <ArrowRight className="w-3 h-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
