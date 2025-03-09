import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { LayoutProps } from "@/Interfaces/interface";

export default function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
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
