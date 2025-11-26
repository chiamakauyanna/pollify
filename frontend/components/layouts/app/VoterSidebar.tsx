import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { selectSidebarState, toggleSidebar } from "@/redux/slices/sidebarSlice";
import { IoMdClose } from "react-icons/io";
import { MdPoll, MdBarChart } from "react-icons/md";
import Logo from "../../common/Logo";

const VoterSidebar: React.FC = () => {
  const isOpen = useSelector(selectSidebarState);
  const dispatch = useDispatch();
  const router = useRouter();

  // Voter menu items only
  const menuItems = [
    { name: "Active Polls", href: "/dashboard/voter", icon: <MdPoll /> },
    { name: "Results", href: "/dashboard/voter/results", icon: <MdBarChart /> },
  ];

  return (
    <aside
      className={`bg-background h-screen transition-all fixed md:relative z-50 ${
        isOpen ? "lg:w-72 md:w-64 w-58" : "w-20 md:w-20"
      } md:block ${isOpen ? "left-0" : "-left-full"} md:left-0 top-0`}
    >
      {/* Menu Button + Logo */}
      <div className="flex items-center gap-3 p-6">
        <button
          className="text-2xl focus:outline-none lg:hidden md:hidden flex"
          onClick={() => dispatch(toggleSidebar())}
        >
          <IoMdClose />
        </button>
        <div className={`${isOpen ? "flex" : "hidden"}`}>
          <Logo />
        </div>
      </div>

      {/* Menu */}
      <div className="bg-primary h-full flex flex-col justify-between py-12 rounded-tr-4xl">
        <nav className="space-y-8 mt-6 pt-6 pl-6 text-background">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 text-lg transition-all hover:bg-white/20 px-4 py-2 rounded-lg"
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

export default VoterSidebar;
