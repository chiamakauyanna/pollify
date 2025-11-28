import Logo from "@/components/common/Logo";
import Button from "@/components/common/Button";
import Link from "next/link";

const Header = () => {
  return (
    <div className="flex justify-between items-center lg:px-14 md:px-12 px-8 py-4 fixed w-full bg-background z-10">
      <Logo />

      <div className="flex gap-3">
            <Link href="/polls/create">
              <Button className="button-primary py-2 px-4 text-sm">Create Poll</Button>
            </Link>
      </div>
    </div>
  );
};

export default Header;
