import { useState } from "react";
import Header from "./MainHeader";
import Sidebar from "./Sidebar";
import { LayoutProps } from "@/Interfaces/interface";

const Layout: React.FC<LayoutProps> = ({ children, isAdmin }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} isAdmin={isAdmin} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      
      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-background text-text">
        {/* Header */}
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} userName={""} userImage={""} />
        
        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
