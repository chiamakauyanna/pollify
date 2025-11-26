import { LayoutProps } from "../../../Interfaces/interface";
import AdminSidebar from "./AdminSidebar";
import ProtectedRoute from "../../ProtectedRoute";
import AdminHeader from "./AdminHeader";

export default function AppLayout({ children }: LayoutProps) {

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        {/* Sidebar */}
        <AdminSidebar
        />
        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-background text-text">
          {/* Header */}
          <AdminHeader />

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
