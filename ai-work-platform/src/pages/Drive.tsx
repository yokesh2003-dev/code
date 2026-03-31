import React, { useState } from "react";
import { 
  FileText, FileImage, FileBarChart, FileArchive, FileCode, UploadCloud, 
  MoreVertical, Download, Edit2, Trash2, Folder, FolderOpen, Search, 
  LayoutGrid, LayoutList, Share2, CornerUpRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const MOCK_FILES = [
  { id: 1, name: "Q4_Revenue_Report.pdf", type: "pdf", size: "2.4 MB", date: "Oct 24, 2023", status: "Completed", folder: "Q1 Reports" },
  { id: 2, name: "Product_Roadmap_v2.xlsx", type: "sheet", size: "1.1 MB", date: "Oct 22, 2023", status: "In Progress", folder: "All Files" },
  { id: 3, name: "UI_Mockups_Final.png", type: "image", size: "8.5 MB", date: "Oct 20, 2023", status: "Completed", folder: "Design Assets" },
  { id: 4, name: "Onboarding_Guide.docx", type: "doc", size: "450 KB", date: "Oct 15, 2023", status: "Completed", folder: "All Files" },
  { id: 5, name: "Sprint_Planning.pdf", type: "pdf", size: "3.2 MB", date: "Oct 12, 2023", status: "In Progress", folder: "All Files" },
  { id: 6, name: "Analytics_Data.csv", type: "sheet", size: "890 KB", date: "Oct 10, 2023", status: "Completed", folder: "Q1 Reports" },
  { id: 7, name: "Brand_Assets.zip", type: "zip", size: "45 MB", date: "Oct 5, 2023", status: "Declined", folder: "Design Assets" },
  { id: 8, name: "API_Documentation.md", type: "code", size: "220 KB", date: "Oct 1, 2023", status: "Completed", folder: "Shared with me" },
];

const FOLDERS = ["All Files", "Q1 Reports", "Design Assets", "Shared with me"];

export function Drive() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("All Files");
  const { toast } = useToast();

  const filteredFiles = MOCK_FILES.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = activeFolder === "All Files" || f.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'sheet': return <FileBarChart className="w-5 h-5 text-emerald-500" />;
      case 'image': return <FileImage className="w-5 h-5 text-blue-500" />;
      case 'doc': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'zip': return <FileArchive className="w-5 h-5 text-amber-500" />;
      case 'code': return <FileCode className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed': return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case 'In Progress': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case 'Declined': return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const handleAction = (action: string, filename: string) => {
    if (action === 'Rename') {
      prompt("Rename file:", filename);
    } else if (action === 'Delete') {
      confirm(`Are you sure you want to delete ${filename}?`);
    }
  };

  const handleConnect = (provider: string) => {
    toast({
      title: "Coming Soon",
      description: `${provider} integration is not yet available.`,
    });
  };

  return (
    <div className="animate-in fade-in h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Drive</h1>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search files..." 
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-card border border-border focus:border-primary outline-none text-sm shadow-sm"
            />
          </div>
          
          <div className="flex bg-card border border-border rounded-xl p-0.5">
            <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-colors", viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
              <LayoutList className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-colors", viewMode === "grid" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground")}>
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          <button className="flex items-center px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 shadow-lg hover:-translate-y-0.5 transition-all">
            <UploadCloud className="w-4 h-4 mr-2" /> Upload
          </button>
        </div>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Sidebar */}
        <div className="w-56 flex-shrink-0 hidden lg:block">
          <div className="glass-panel rounded-2xl p-3 space-y-1 sticky top-6">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-3 pt-2">Folders</div>
            {FOLDERS.map(folder => (
              <button 
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={cn(
                  "w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  activeFolder === folder ? "bg-primary/10 text-primary" : "text-foreground/70 hover:bg-muted"
                )}
              >
                {activeFolder === folder ? <FolderOpen className="w-4 h-4 mr-3" /> : <Folder className="w-4 h-4 mr-3 text-muted-foreground" />}
                {folder}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto pb-12 pr-2">
          {filteredFiles.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl p-12 text-center">
              <FolderOpen className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-1">No files found</h3>
              <p className="text-sm text-muted-foreground">Try a different search or upload a new file.</p>
            </div>
          ) : viewMode === "list" ? (
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/30 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <div className="col-span-6 md:col-span-5">Name</div>
                <div className="col-span-3 hidden md:block">Date Modified</div>
                <div className="col-span-2 hidden md:block">Size</div>
                <div className="col-span-4 md:col-span-2 text-right md:text-left">Status</div>
              </div>
              
              <div className="divide-y divide-border/50">
                {filteredFiles.map(file => (
                  <div key={file.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors group">
                    <div className="col-span-6 md:col-span-5 flex items-center space-x-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0 shadow-sm">
                        {getFileIcon(file.type)}
                      </div>
                      <span className="font-medium truncate text-sm">{file.name}</span>
                    </div>
                    <div className="col-span-3 hidden md:block text-sm text-muted-foreground">{file.date}</div>
                    <div className="col-span-2 hidden md:block text-sm text-muted-foreground">{file.size}</div>
                    <div className="col-span-4 md:col-span-2 flex items-center justify-between">
                      <span className={cn("text-xs px-2.5 py-1 rounded-md font-medium border hidden sm:inline-block", getStatusBadge(file.status))}>
                        {file.status}
                      </span>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                        <button className="p-1.5 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 hover:bg-background rounded-lg text-muted-foreground hover:text-foreground transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 rounded-xl">
                            <DropdownMenuItem onClick={() => handleAction('Rename', file.name)}><Edit2 className="w-4 h-4 mr-2" /> Rename</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Move', file.name)}><CornerUpRight className="w-4 h-4 mr-2" /> Move to...</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Share', file.name)}><Share2 className="w-4 h-4 mr-2" /> Share</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction('Delete', file.name)} className="text-destructive focus:text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.map(file => (
                <div key={file.id} className="glass-panel rounded-2xl p-4 flex flex-col group hover:-translate-y-1 hover:shadow-lg hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-background border border-border flex items-center justify-center shadow-sm">
                      {getFileIcon(file.type)}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-muted rounded-lg text-muted-foreground transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem onClick={() => handleAction('Rename', file.name)}><Edit2 className="w-4 h-4 mr-2" /> Rename</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('Delete', file.name)} className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <h4 className="font-semibold text-sm truncate mb-1" title={file.name}>{file.name}</h4>
                  <div className="flex justify-between items-center mt-auto pt-4">
                    <span className="text-xs text-muted-foreground font-medium">{file.size}</span>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-md font-bold border", getStatusBadge(file.status))}>
                      {file.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Connected Storage */}
          <div className="mt-12">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              Connected Storage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 shadow-sm border border-border">
                    <svg viewBox="0 0 87.3 87.3" className="w-full h-full"><path d="M58 58.4L43.4 83.6H14.6L29.2 58.4z" fill="#0066da"/><path d="M58.1 58.4H87.3L72.7 83.6H43.4z" fill="#00ac47"/><path d="M72.7 33.1L58.1 58.4H29.2L43.8 33.1z" fill="#ea4335"/><path d="M29.2 58.4L14.6 83.6 0 58.4l14.6-25.3z" fill="#00832d"/><path d="M72.7 33.1L87.3 58.4 72.7 83.6 58.1 58.4z" fill="#2684fc"/><path d="M43.8 33.1L29.2 58.4 14.6 33.1 29.2 7.8z" fill="#ffba00"/></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Google Drive</h4>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-medium mt-1 inline-block">Coming Soon</span>
                  </div>
                </div>
                <button onClick={() => handleConnect('Google Drive')} className="px-4 py-2 text-sm font-semibold border-2 border-border rounded-xl hover:border-primary hover:text-primary transition-colors">
                  Connect
                </button>
              </div>

              <div className="glass-panel p-5 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center p-2 shadow-sm border border-border">
                    <svg viewBox="0 0 23 23" className="w-full h-full text-[#0078D4]"><path fill="currentColor" d="M10.89 0L10.89 10.89L0 10.89L0 0L10.89 0Z"/><path fill="currentColor" d="M23 0L23 10.89L12.11 10.89L12.11 0L23 0Z"/><path fill="currentColor" d="M10.89 12.11L10.89 23L0 23L0 12.11L10.89 12.11Z"/><path fill="currentColor" d="M23 12.11L23 23L12.11 23L12.11 12.11L23 12.11Z"/></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Microsoft OneDrive</h4>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-medium mt-1 inline-block">Coming Soon</span>
                  </div>
                </div>
                <button onClick={() => handleConnect('OneDrive')} className="px-4 py-2 text-sm font-semibold border-2 border-border rounded-xl hover:border-primary hover:text-primary transition-colors">
                  Connect
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
