import Button from "../common/Button";
import Logo from "../common/Logo";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex justify-between items-center lg:px-14 md:px-12 px-8 py-4 fixed w-full bg-background z-10 shadow-lg">
      <Logo />
      <div className="">
        <Link href="/create-poll">
          <Button text="Register" className="button-primary py-3 px-2 lg:text-sm md:text-sm text-xs">
            Create Poll
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
