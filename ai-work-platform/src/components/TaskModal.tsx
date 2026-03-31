import React, { useState } from "react";
import { X, Trash2, Save, Send, User, Share, Copy, Mail } from "lucide-react";
import { Task } from "@/lib/types";
import { useStore } from "@/lib/store";
import { format } from "date-fns";
import { generateId, cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface TaskModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskModal({ task, onClose }: TaskModalProps) {
  const { state, dispatch } = useStore();
  const [edited, setEdited] = useState<Task>(task);
  const [newComment, setNewComment] = useState("");
  const [newCc, setNewCc] = useState("");

  const handleSave = () => {
    // Determine changes for activity log
    const changes = [];
    if (edited.status !== task.status) changes.push(`Status: ${edited.status}`);
    if (edited.owner !== task.owner) changes.push(`Owner: ${edited.owner}`);
    
    let updatedTask = { ...edited };
    if (changes.length > 0) {
      updatedTask.activityLog = [
        ...(updatedTask.activityLog || []),
        { action: "Updated", timestamp: new Date().toISOString(), user: state.currentUser }
      ];
    }

    dispatch({ type: "UPDATE_TASK", payload: updatedTask });
    
    if (changes.length > 0) {
      dispatch({ 
        type: "ADD_ACTIVITY", 
        payload: { id: generateId(), action: "Task Updated", details: `${edited.title} (${changes.join(', ')})`, timestamp: new Date().toISOString(), user: state.currentUser }
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Delete this task?")) {
      dispatch({ type: "DELETE_TASK", payload: task.id });
      onClose();
    }
  };

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment = { id: generateId(), text: newComment, author: state.currentUser, createdAt: new Date().toISOString() };
    setEdited({ ...edited, comments: [...edited.comments, comment] });
    setNewComment("");
  };

  const addCc = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newCc.trim()) {
      if (!edited.ccList) edited.ccList = [];
      if (!edited.ccList.includes(newCc.trim())) {
        setEdited({ ...edited, ccList: [...edited.ccList, newCc.trim()] });
      }
      setNewCc("");
    }
  };

  const removeCc = (email: string) => {
    setEdited({ ...edited, ccList: edited.ccList.filter(e => e !== email) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
      <div className="glass-panel w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl relative animate-in zoom-in-95 border border-border">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card rounded-t-2xl">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold">Edit Task</h2>
            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-md border", 
              edited.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
              edited.status === 'Skipped' ? 'bg-muted text-muted-foreground border-border' : 
              'bg-blue-500/10 text-blue-500 border-blue-500/20'
            )}>
              {edited.status}
            </span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:bg-muted p-2 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Title</label>
            <input 
              value={edited.title}
              onChange={e => setEdited({...edited, title: e.target.value})}
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-2 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-muted-foreground">Description</label>
            <textarea 
              value={edited.description}
              onChange={e => setEdited({...edited, description: e.target.value})}
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-2 h-24 resize-none focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-sm"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-muted-foreground">Owner</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  value={edited.owner}
                  onChange={e => setEdited({...edited, owner: e.target.value})}
                  className="w-full pl-9 pr-4 py-2 bg-background border-2 border-border rounded-xl focus:border-primary outline-none transition-all text-sm font-medium"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-muted-foreground">Assigned By</label>
              <input 
                value={edited.assignedBy || ""}
                onChange={e => setEdited({...edited, assignedBy: e.target.value})}
                className="w-full bg-muted border-2 border-transparent rounded-xl px-4 py-2 focus:border-primary outline-none transition-all text-sm font-medium"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-muted-foreground">Status</label>
              <select 
                value={edited.status}
                onChange={e => setEdited({...edited, status: e.target.value as Task["status"]})}
                className="w-full bg-background border-2 border-border rounded-xl px-4 py-2 focus:border-primary outline-none transition-all appearance-none text-sm font-medium cursor-pointer"
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
                <option>Expired</option>
                <option>Skipped</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-muted-foreground">Priority</label>
              <select 
                value={edited.priority}
                onChange={e => setEdited({...edited, priority: e.target.value as Task["priority"]})}
                className="w-full bg-background border-2 border-border rounded-xl px-4 py-2 focus:border-primary outline-none transition-all appearance-none text-sm font-medium cursor-pointer"
              >
                <option>Urgent</option>
                <option>Important</option>
                <option>Later</option>
                <option>Optional</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-muted-foreground">Deadline</label>
              <input 
                type="date"
                value={format(new Date(edited.deadline), 'yyyy-MM-dd')}
                onChange={e => setEdited({...edited, deadline: new Date(e.target.value).toISOString()})}
                className="w-full bg-background border-2 border-border rounded-xl px-4 py-2 focus:border-primary outline-none transition-all text-sm font-medium cursor-pointer"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-semibold text-muted-foreground">CC List</label>
              <div className="w-full bg-background border-2 border-border rounded-xl p-1.5 focus-within:border-primary transition-all min-h-[44px] flex flex-wrap gap-1.5">
                {edited.ccList?.map(email => (
                  <span key={email} className="bg-muted text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                    {email}
                    <button onClick={() => removeCc(email)} className="hover:text-destructive"><X className="w-3 h-3" /></button>
                  </span>
                ))}
                <input 
                  value={newCc}
                  onChange={e => setNewCc(e.target.value)}
                  onKeyDown={addCc}
                  placeholder={edited.ccList?.length ? "Add more..." : "Press enter to add..."}
                  className="flex-1 bg-transparent outline-none text-sm min-w-[100px] px-1"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Comments Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Comments ({edited.comments.length})</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {edited.comments.length === 0 && <p className="text-sm text-muted-foreground italic bg-muted/30 p-3 rounded-xl border border-dashed border-border">No comments yet.</p>}
                {edited.comments.map(c => (
                  <div key={c.id} className="bg-muted/50 p-3 rounded-xl text-sm border border-border/50 relative group">
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="font-bold text-primary text-xs">{c.author}</span>
                      <span className="text-[10px] text-muted-foreground font-medium">{format(new Date(c.createdAt), 'MMM d, h:mm a')}</span>
                    </div>
                    <p className="text-foreground/90">{c.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2 pt-2">
                <input 
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addComment()}
                  placeholder="Type a comment..."
                  className="flex-1 bg-background border-2 border-border rounded-xl px-4 py-2 focus:border-primary outline-none text-sm"
                />
                <button onClick={addComment} className="bg-secondary text-secondary-foreground px-4 rounded-xl hover:bg-secondary/80 transition-colors flex items-center shadow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Activity Log Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Activity Log</h3>
              <div className="relative border-l-2 border-muted ml-3 space-y-4 max-h-60 overflow-y-auto pl-4 py-1">
                {(!edited.activityLog || edited.activityLog.length === 0) && (
                  <p className="text-sm text-muted-foreground italic">No recent activity.</p>
                )}
                {edited.activityLog?.slice().reverse().map((log, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-primary/20 border border-primary"></div>
                    <p className="text-xs text-muted-foreground mb-0.5"><span className="font-semibold text-foreground">{log.user}</span> • {format(new Date(log.timestamp), 'MMM d, h:mm a')}</p>
                    <p className="text-sm font-medium">{log.action}</p>
                  </div>
                ))}
                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-muted-foreground/20 border border-muted-foreground"></div>
                  <p className="text-xs text-muted-foreground mb-0.5"><span className="font-semibold text-foreground">System</span> • {format(new Date(edited.createdAt), 'MMM d, h:mm a')}</p>
                  <p className="text-sm font-medium">Task Created</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/30 flex justify-between items-center rounded-b-2xl">
          <div className="flex gap-2">
            <button onClick={handleDelete} className="flex items-center p-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-white rounded-xl transition-colors" title="Delete Task">
              <Trash2 className="w-4 h-4" />
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center px-3 py-2 text-sm font-medium bg-card border border-border hover:bg-muted rounded-xl transition-colors">
                  <Share className="w-4 h-4 mr-2" /> Share
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 rounded-xl glass-panel">
                <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied!"); }}>
                  <Copy className="w-4 h-4 mr-2" /> Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => window.open(`mailto:?subject=Task: ${edited.title}&body=Check out this task.`)}>
                  <Mail className="w-4 h-4 mr-2" /> Email Colleague
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex space-x-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-bold hover:bg-muted rounded-xl transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="flex items-center px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
