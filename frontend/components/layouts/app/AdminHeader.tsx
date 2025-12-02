import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, selectSidebarState } from "@/redux/slices/sidebarSlice";
import { logout } from "@/redux/slices/authSlice";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";
import { useRouter } from "next/router";
import { LogOutIcon } from "lucide-react";

const AdminHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isSidebarOpen = useSelector(selectSidebarState);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <header className="bg-background flex items-center justify-between py-4 px-6">
      {/* Menu Button - Toggle Sidebar */}
      <button
        className="text-2xl focus:outline-none"
        onClick={() => dispatch(toggleSidebar())}
      >
        {!isSidebarOpen ? <HiArrowLongRight size={28} /> : <HiArrowLongLeft />}
      </button>

      {/* Right Side - Admin Info + Logout */}
      <div className="flex items-center gap-4">
        <p className="bg-primary text-background px-4 py-2 rounded-lg text-sm">
          Admin
        </p>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 focus:outline-none"
          title="Logout"
        >
          <LogOutIcon size={24} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
