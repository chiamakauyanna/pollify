import { useState } from "react";
import { LayoutProps } from "../../../Interfaces/interface";
import Header from "./Header";
import AdminSidebar from "./AdminSidebar";
import ProtectedRoute from "../../ProtectedRoute";

export default function AppLayout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar
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
    </ProtectedRoute>
  );
}
