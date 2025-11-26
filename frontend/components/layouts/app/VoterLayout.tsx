import { useState } from "react";
import { LayoutProps } from "../../../Interfaces/interface";
import Header from "./Header";
import VoterSidebar from "./VoterSidebar";

export default function VoterLayout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <VoterSidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-background text-text">
        {/* Header */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
