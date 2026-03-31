import React from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { FloatingMic } from "../FloatingMic";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto relative scroll-smooth">
          <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
      <FloatingMic />
    </div>
  );
}
