import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, selectSidebarState } from "@/redux/slices/sidebarSlice";
import { IoMdMenu } from "react-icons/io";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";

const AdminHeader = () => {
  const dispatch = useDispatch();
  const isSidebarOpen = useSelector(selectSidebarState);

  return (
    <header className="bg-background flex items-center justify-between py-4 px-6">
      {/* Menu Button - Toggle Sidebar */}
      <button
        className="text-2xl focus:outline-none"
        onClick={() => dispatch(toggleSidebar())}
      >
        {!isSidebarOpen ? <HiArrowLongRight size={28}/> : <HiArrowLongLeft />}
      </button>

      {/* User Profile */}
      <div className="">
        <p className="bg-primary text-background px-4 py-2 rounded-lg text-sm">
          Admin
        </p>
      </div>
    </header>
  );
};

export default AdminHeader;
