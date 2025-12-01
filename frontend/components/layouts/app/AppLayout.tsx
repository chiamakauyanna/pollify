import { LayoutProps } from "../../../Interfaces/interface";
import AdminSidebar from "./AdminSidebar";
import ProtectedRoute from "../../ProtectedRoute";
import AdminHeader from "./AdminHeader";

export default function AppLayout({ children }: LayoutProps) {
  return (
    <ProtectedRoute>
      <div className="flex h-full ">
        <AdminSidebar />
        <div className="flex-1 flex flex-col bg-primary/5 text-text">
          <AdminHeader />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
