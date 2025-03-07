import Link from "next/link";
import { FiBarChart2, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { selectSidebarState } from "@/redux/slices/sidebarSlice";
import Logo from "../common/Logo";
import { IoMdClose } from "react-icons/io";
import { toggleSidebar } from "@/redux/slices/sidebarSlice";

const Sidebar: React.FC = () => {
  const isOpen = useSelector(selectSidebarState);
  const dispatch = useDispatch();

  return (
    <aside
      className={`bg-background h-screen transition-all fixed md:relative z-50 ${
        isOpen ? "lg:w-72 md:w-64 w-58" : "w-20 md:w-20"
      }  md:block ${isOpen ? "left-0" : "-left-full"} md:left-0 top-0`}
    >
      {/* Menu Button - Toggle Sidebar */}

      <div className="flex items-center gap-3 p-6">
        <button
          className="text-2xl focus:outline-none lg:hidden md:hidden flex"
          onClick={() => dispatch(toggleSidebar())}
        >
          <IoMdClose />
        </button>
        {/* {logo} */}
        <div className={`${isOpen ? "flex" : "hidden"}`}>
          <Logo />
        </div>
      </div>

      <div className="bg-primary h-full flex flex-col justify-between py-12 rounded-tr-4xl">
        <div>
          {/* Navigation Links */}
          <nav className="space-y-8 mt-6 pt-6 pl-6 text-background">
            <Link href="/" className="flex items-center gap-4 text-lg">
              <FiBarChart2 />
              {isOpen && <span className="text-lg">Dashboard</span>}
            </Link>

            <Link href="/vote" className="flex items-center gap-4 text-lg">
              <FiUser />
              {isOpen && <span>Vote Now</span>}
            </Link>
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
