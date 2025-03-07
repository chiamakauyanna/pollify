import { useState } from "react";
import Link from "next/link";
import { FiLogOut, FiBarChart2, FiUser, FiEdit } from "react-icons/fi";
import { IoMdMenu } from "react-icons/io";
import Image from "next/image";
import { SidebarProps } from "@/Interfaces/interface";
import profilePic from "@/assets/images/profile_pic.png";
import Logo from "../common/Logo";

const Sidebar: React.FC<SidebarProps> = ({ userType, userName, userImage }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside
    className={`bg-background h-screen transition-all fixed md:relative z-50 ${
      isOpen ? "lg:w-72 md:w-64 w-58" : "w-20 md:w-20"
    }  md:block ${isOpen ? "left-0" : "-left-full"} md:left-0 top-0`}
  >
      <div className="flex justify-around items-center p-6">
        {/* Sidebar Toggle Button */}
        <button
          className="text-text text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
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
            {isOpen && <p className="font-bold text-background">Chiamaka Uyanna</p>}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-8 mt-6 pt-6 pl-6 text-background">
            <Link href="/dashboard" className="flex items-center gap-4 text-lg">
            <div>
              <FiBarChart2 />
            </div>
              
              {isOpen && <span className="text-lg">Dashboard</span>}
            </Link>

            <Link href="/vote" className="flex items-center lg:justify-start md:justify-start justify-center gap-4 text-lg">
              <div className="">
                <FiUser />
              </div>
              {isOpen && <span>Vote Now</span>}
            </Link>

            {/* Admin Only: Manage Polls */}
            {userType === "admin" && (
              <Link
                href="/manage-polls"
                className="flex items-center gap-3 text-lg"
              >
                <FiEdit />
                {isOpen && <span>Manage Polls</span>}
              </Link>
            )}
          </nav>
        </div>

        <div>
          {/* Logout */}
          <button className="text-lg text-background flex gap-4 pl-4 items-center">
            <FiLogOut />
            {isOpen && <span>Log out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
