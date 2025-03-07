import { HeaderProps } from "@/Interfaces/interface";
import Image from "next/image";
import { FiSearch } from "react-icons/fi";
import profilePic from "@/assets/images/profile_pic.png";

const Header: React.FC<HeaderProps> = ({ userName, userImage, toggleSidebar }) => {
  return (
    <header className="bg-background flex items-center justify-between py-4 px-6">

      {/* Search Bar */}
      <div className="relative w-2/3">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 pl-10 outline-1 outline-primary focus:border-0 rounded-lg focus:ring-2 focus:ring-primary"
        />
        <FiSearch className="absolute left-3 top-3 text-gray-500" />
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3">
        <Image
          src={profilePic}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-semibold bg-primary px-4 py-3 rounded-full">C</p>
      </div>
    </header>
  );
};

export default Header;
