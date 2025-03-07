import Button from "@/components/common/Button";
import Logo from "@/components/common/Logo";
import NavBar from "@/components/common/NavBar";
import Link from "next/link";
import { useState } from "react";
import { IoMdMenu } from "react-icons/io";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex justify-between items-center lg:px-14 md:px-12 px-8  py-4 fixed w-full bg-background z-10">
      <Logo />
      <div className="lg:flex md:flex hidden">
        <NavBar />
      </div>
      
      <button
        className="text-text text-2xl focus:outline-none md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoMdMenu />
      </button>
      <div className="flex gap-4">
        <Link href="/register">
          <Button text="Register" className="button-primary py-3" />
        </Link>
        <Link href="/login">
          <Button text="Login" className="button-secondary py-3" />
        </Link>
      </div>
    </div>
  );
};

export default Header;
