import Link from "next/link";
import { FiLogOut, FiBarChart2, FiUser, FiEdit } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, closeSidebar } from "@/store/slices/sidebarSlice";
import { RootState } from "@/store";
import profilePic from "@/assets/images/profile_pic.png";
import Logo from "../common/Logo";

const Sidebar = ({ userType }) => {
  const isOpen = useSelector((state: RootState) => state.sidebar.isOpen);
  const dispatch = useDispatch();

  return (
    <>
      {/* Menu Icon (Always visible on small screens) */}
      <button
        className="text-text text-2xl focus:outline-none fixed top-4 left-4 z-50 md:hidden"
        onClick={() => dispatch(toggleSidebar())}
      >
        <IoMdMenu />
      </button>

      <aside
        className={`bg-background h-screen transition-all fixed md:relative z-40 ${
          isOpen ? "w-64 md:w-72 left-0" : "w-20 md:w-20 -left-full md:left-0"
        } top-0 shadow-lg`}
      >
        <div className="flex justify-around items-center p-6">
          {/* Sidebar Toggle Button */}
          <button
            className="text-text text-2xl focus:outline-none"
            onClick={() => dispatch(toggleSidebar())}
          >
            <IoMdMenu />
          </button>
          {/* {logo} */}
          <div className={`${isOpen ? "flex" : "hidden"}`}>
            <Logo />
          </div>
        </div>

        <div className="bg-primary h-full flex flex-col justify-between py-12 rounded-tr-4xl">
          <div>
            {/* Profile Section */}
            <div className="flex flex-col items-center gap-6">
              <Image
                src={profilePic}
                alt="User Avatar"
                className={` rounded-full object-cover border-3 border-background ${
                  isOpen ? "lg:w-32 lg:h-32 md:w-28 md:h-28" : "w-12 h-12"
                }`}
              />
              {isOpen && <p className="font-bold">Chiamaka Uyanna</p>}
            </div>

            {/* Navigation Links */}
            <nav className="space-y-6 mt-6 pt-6 pl-4 text-background">
              <Link
                href="/dashboard"
                className="flex items-center gap-4 text-lg"
                onClick={() => dispatch(closeSidebar())}
              >
                <FiBarChart2 />
                {isOpen && <span className="text-lg">Dashboard</span>}
              </Link>

              <Link
                href="/vote"
                className="flex items-center gap-4 text-lg"
                onClick={() => dispatch(closeSidebar())}
              >
                <FiUser />
                {isOpen && <span>Vote Now</span>}
              </Link>

              {/* Admin Only: Manage Polls */}
              {userType === "admin" && (
                <Link
                  href="/manage-polls"
                  className="flex items-center gap-3 text-lg"
                  onClick={() => dispatch(closeSidebar())}
                >
                  <FiEdit />
                  {isOpen && <span>Manage Polls</span>}
                </Link>
              )}
            </nav>
          </div>

          <div>
            {/* Logout */}
            <button
              className="text-lg text-background flex gap-4 pl-4 items-center"
              onClick={() => dispatch(closeSidebar())}
            >
              <FiLogOut />
              {isOpen && <span>Log out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Click outside to close sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden z-30"
          onClick={() => dispatch(closeSidebar())}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
