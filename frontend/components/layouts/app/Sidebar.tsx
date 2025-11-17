import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { selectSidebarState, toggleSidebar } from "@/redux/slices/sidebarSlice";
import Logo from "../../common/Logo";
import { IoMdClose } from "react-icons/io";
import { MdDashboard, MdHowToVote } from "react-icons/md"; 
import { SidebarProps } from "@/Interfaces/interface";

const Sidebar: React.FC<SidebarProps> = () => {
  const isOpen = useSelector(selectSidebarState);
  const dispatch = useDispatch();
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: <MdDashboard /> },
    { name: "Vote", href: "/vote", icon: <MdHowToVote /> },
  ];

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
        {/* Logo */}
        <div className={`${isOpen ? "flex" : "hidden"}`}>
          <Logo />
        </div>
      </div>

      <div className="bg-primary h-full flex flex-col justify-between py-12 rounded-tr-4xl">
        <nav className="space-y-8 mt-6 pt-6 pl-6 text-background">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 text-lg transition-all ${
                router.pathname === item.href
                  ? "bg-background text-primary px-4 py-2 rounded-l-lg"
                  : "hover:bg-white/20 px-4 py-2 rounded-lg"
              }`}
            >
              {item.icon}
              {isOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
