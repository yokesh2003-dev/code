import React, { useState } from "react";
import { useStore } from "@/lib/store";
import { Save, User, Building, Palette, AlertTriangle, Users, Mail, Plus, X, UploadCloud, ChevronDown } from "lucide-react";
import { generateId } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function Settings() {
  const { state, dispatch } = useStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // Tab 1 & 5
  const [workspaceName, setWorkspaceName] = useState(state.workspace.name);
  const [supportEmail, setSupportEmail] = useState(state.workspace.supportEmail || "");
  const [userName, setUserName] = useState(state.currentUser);
  const [theme, setTheme] = useState(state.theme);

  // Tab 2
  const members = state.workspace.members || [];
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");

  // Tab 3
  const [primaryColor, setPrimaryColor] = useState(state.workspace.branding?.primaryColor || "#9333ea"); // Default purple

  const handleSaveGeneral = () => {
    dispatch({ type: "UPDATE_WORKSPACE", payload: { name: workspaceName, supportEmail } });
    toast({ title: "Saved", description: "Workspace details updated successfully." });
  };

  const handleSaveProfile = () => {
    dispatch({ type: "UPDATE_USER", payload: userName });
    dispatch({ type: "SET_THEME", payload: theme as "light" | "dark" });
    toast({ title: "Saved", description: "Profile settings updated." });
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    toast({ title: "Invite Sent", description: `An invitation has been sent to ${inviteEmail} as ${inviteRole}.` });
    setInviteEmail("");
  };

  const handleRemoveMember = (id: string) => {
    if (confirm("Remove this member?")) {
      const updated = members.filter(m => m.id !== id);
      dispatch({ type: "UPDATE_WORKSPACE_MEMBERS", payload: { workspaceId: state.activeWorkspaceId, members: updated } });
    }
  };

  const handleChangeRole = (id: string, role: "Admin" | "Editor" | "Viewer") => {
    const updated = members.map(m => m.id === id ? { ...m, role } : m);
    dispatch({ type: "UPDATE_WORKSPACE_MEMBERS", payload: { workspaceId: state.activeWorkspaceId, members: updated } });
  };

  const handleSaveBranding = () => {
    dispatch({ 
      type: "UPDATE_WORKSPACE", 
      payload: { 
        branding: { ...state.workspace.branding, primaryColor } 
      } 
    });
    toast({ title: "Saved", description: "Workspace branding updated." });
  };

  const handleDeleteWorkspace = () => {
    const wsTasks = state.tasks.filter(t => t.workspaceId === state.activeWorkspaceId);
    const count = wsTasks.length;
    const confirmText = prompt(`Type "DELETE" to confirm removing this workspace and its ${count} tasks. This is irreversible.`);
    if (confirmText === "DELETE") {
      toast({ title: "Mock Deletion", description: "Workspace deleted (mocked)." });
      // Would normally dispatch a DELETE_WORKSPACE action here
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: Building },
    { id: "members", label: "Members", icon: Users },
    { id: "branding", label: "Branding", icon: Palette },
    { id: "profile", label: "My Profile", icon: User },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle },
  ];

  return (
    <div className="animate-in fade-in flex flex-col md:flex-row gap-8 max-w-5xl mx-auto min-h-[calc(100vh-120px)]">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 flex-shrink-0 space-y-2">
        <h1 className="text-3xl font-bold mb-6 px-2">Settings</h1>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all ${
                isActive 
                  ? tab.id === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 mr-3 ${isActive ? '' : 'opacity-70'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 glass-panel rounded-3xl p-6 md:p-8 min-h-[500px]">
        {/* TAB 1: GENERAL */}
        {activeTab === "general" && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold border-b border-border pb-4 mb-6">Workspace Settings</h2>
            
            <div className="space-y-4 max-w-md">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Workspace Name</label>
                <input 
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full bg-background border-2 border-border rounded-xl px-4 py-2.5 focus:border-primary outline-none transition-colors font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Support Email</label>
                <input 
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@company.com"
                  className="w-full bg-background border-2 border-border rounded-xl px-4 py-2.5 focus:border-primary outline-none transition-colors font-semibold"
                />
              </div>
            </div>

            <div className="pt-6">
              <button onClick={handleSaveGeneral} className="flex items-center px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                <Save className="w-5 h-5 mr-2" /> Save Settings
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: MEMBERS */}
        {activeTab === "members" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 flex flex-col h-full">
            <h2 className="text-2xl font-bold border-b border-border pb-4 mb-2 flex items-center justify-between">
              Manage Members
              <span className="text-sm bg-muted text-foreground px-3 py-1 rounded-full font-medium">{members.length} Total</span>
            </h2>
            
            <div className="flex-1 overflow-auto">
              <div className="border border-border rounded-2xl overflow-hidden bg-background">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-bold">
                    <tr>
                      <th className="px-6 py-4">User</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.map(member => (
                      <tr key={member.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4 flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-foreground">{member.name}</div>
                            {member.email && <div className="text-xs text-muted-foreground">{member.email}</div>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <select 
                            value={member.role}
                            onChange={(e) => handleChangeRole(member.id, e.target.value as any)}
                            className="bg-transparent border border-border rounded-lg px-2 py-1 outline-none focus:border-primary text-sm font-medium cursor-pointer"
                          >
                            <option value="Admin">Admin</option>
                            <option value="Editor">Editor</option>
                            <option value="Viewer">Viewer</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleRemoveMember(member.id)} className="text-muted-foreground hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Invite New Member</h3>
              <form onSubmit={handleInvite} className="flex gap-3 items-start">
                <div className="flex-1">
                  <input 
                    type="email" 
                    required
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    className="w-full bg-background border-2 border-border rounded-xl px-4 py-2.5 focus:border-primary outline-none text-sm font-medium"
                  />
                </div>
                <select 
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  className="bg-background border-2 border-border rounded-xl px-4 py-2.5 focus:border-primary outline-none text-sm font-medium cursor-pointer appearance-none min-w-[120px]"
                >
                  <option value="Admin">Admin</option>
                  <option value="Editor">Editor</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button type="submit" className="px-6 py-2.5 bg-secondary text-secondary-foreground font-bold rounded-xl hover:bg-secondary/80 flex items-center whitespace-nowrap transition-colors border border-border shadow-sm">
                  <Mail className="w-4 h-4 mr-2" /> Send Invite
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: BRANDING */}
        {activeTab === "branding" && (
          <div className="space-y-8 animate-in slide-in-from-right-4">
            <h2 className="text-2xl font-bold border-b border-border pb-4 mb-6">Workspace Branding</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Brand Color</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input 
                      type="text"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 bg-background border-2 border-border rounded-xl px-4 py-2.5 focus:border-primary outline-none font-mono text-sm uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Workspace Logo</label>
                  <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-muted/30 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="font-semibold text-sm">Click to upload logo</p>
                    <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG (max. 2MB)</p>
                  </div>
                </div>

                <button onClick={handleSaveBranding} className="flex items-center px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                  <Save className="w-5 h-5 mr-2" /> Save Branding
                </button>
              </div>

              {/* Live Preview */}
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block mb-3">Live Preview (Sidebar)</label>
                <div className="border-2 border-border rounded-2xl overflow-hidden bg-sidebar w-64 h-80 flex flex-col shadow-2xl" style={{ '--primary': primaryColor } as React.CSSProperties}>
                  <div className="h-16 flex items-center px-4 border-b border-sidebar-border bg-sidebar">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20 mr-3">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-sidebar-foreground leading-tight tracking-tight">AI Work OS</span>
                      <span className="text-xs text-sidebar-foreground/60 leading-tight">{workspaceName}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center px-3">
                      <div className="w-4 h-4 rounded-sm bg-primary mr-2 opacity-80"></div>
                      <div className="h-2.5 w-20 bg-primary/50 rounded"></div>
                    </div>
                    <div className="h-8 rounded-lg bg-sidebar-border/30 flex items-center px-3">
                       <div className="w-4 h-4 rounded-sm bg-sidebar-foreground/30 mr-2"></div>
                       <div className="h-2.5 w-16 bg-sidebar-foreground/30 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 max-w-md">
            <h2 className="text-2xl font-bold border-b border-border pb-4 mb-6">Personal Profile</h2>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Display Name</label>
                <input 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-background border-2 border-border rounded-xl px-4 py-2.5 focus:border-primary outline-none transition-colors font-semibold"
                />
              </div>

              <div className="space-y-3 pt-4">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Theme Preference</label>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => setTheme("dark")}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${theme === 'dark' ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    <div className="w-full h-16 bg-[#09090b] rounded-lg mb-3 border border-[#27272a] p-2 flex flex-col gap-2">
                      <div className="h-2 w-1/3 bg-[#27272a] rounded"></div>
                      <div className="h-6 w-full bg-[#18181b] rounded"></div>
                    </div>
                    <span className="font-bold text-sm">Dark Mode</span>
                  </button>
                  <button 
                    onClick={() => setTheme("light")}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${theme === 'light' ? 'border-primary bg-primary/5 shadow-md' : 'border-border bg-background hover:border-primary/50'}`}
                  >
                    <div className="w-full h-16 bg-[#ffffff] rounded-lg mb-3 border border-[#e4e4e7] p-2 flex flex-col gap-2">
                      <div className="h-2 w-1/3 bg-[#e4e4e7] rounded"></div>
                      <div className="h-6 w-full bg-[#f4f4f5] rounded"></div>
                    </div>
                    <span className="font-bold text-sm">Light Mode</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button onClick={handleSaveProfile} className="flex items-center px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all">
                <Save className="w-5 h-5 mr-2" /> Update Profile
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: DANGER ZONE */}
        {activeTab === "danger" && (
          <div className="space-y-6 animate-in slide-in-from-right-4 max-w-lg">
            <h2 className="text-2xl font-bold text-destructive border-b border-border pb-4 mb-6 flex items-center">
              <AlertTriangle className="w-6 h-6 mr-2" /> Danger Zone
            </h2>
            
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-2">Delete Workspace</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Permanently delete this workspace and all of its data. This action is not reversible.
              </p>
              
              <div className="bg-background border border-border rounded-xl p-4 mb-6">
                <p className="text-sm font-medium">This workspace currently has:</p>
                <ul className="list-disc ml-5 mt-2 text-sm text-muted-foreground">
                  <li>{state.tasks.filter(t => t.workspaceId === state.activeWorkspaceId).length} tasks</li>
                  <li>{state.notes.filter(n => n.workspaceId === state.activeWorkspaceId).length} notes</li>
                  <li>{members.length} members</li>
                </ul>
              </div>

              <button 
                onClick={handleDeleteWorkspace}
                className="w-full flex justify-center items-center px-6 py-3 bg-destructive text-destructive-foreground font-bold rounded-xl hover:bg-destructive/90 transition-colors shadow-lg shadow-destructive/20"
              >
                Delete {workspaceName}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Sparkles(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  )
}
