import { useDispatch } from "react-redux";
import { toggleSidebar } from "@/redux/slices/sidebarSlice"; 
import { HeaderProps } from "@/Interfaces/interface";
import { IoMdMenu } from "react-icons/io";
import { useAuth } from "@/hooks/useAuth";

const Header: React.FC<HeaderProps> = () => {
  const dispatch = useDispatch(); 
    const { user } = useAuth();

  return (
    <header className="bg-background flex items-center justify-between py-4 px-6">
      {/* Menu Button - Toggle Sidebar */}
      <button
        className="text-2xl focus:outline-none"
        onClick={() => dispatch(toggleSidebar())} // Toggle Sidebar using Redux
      >
        <IoMdMenu />
      </button>

      {/* User Profile */}
      <div className="">
        <p className="bg-primary text-background px-4 py-2 rounded-lg text-sm">{user?.username || 'Voter'}</p>
      </div>
    </header>
  );
};

export default Header;
