import Logo from "@/components/common/Logo";
import Button from "@/components/common/Button";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const Header = () => {
  const { isAuthenticated, logoutUser } = useAuth();

  return (
    <div className="flex justify-between items-center lg:px-14 md:px-12 px-8 py-4 fixed w-full bg-background z-10">
      <Logo />

      <div className="flex gap-3">
        {!isAuthenticated ? (
          <>
            <Link href="/auth/login">
              <Button className="button-primary py-2 px-4 text-sm">Login</Button>
            </Link>
            <Link href="/auth/register">
              <Button className="button-secondary py-2 px-4 text-sm">Register</Button>
            </Link>
          </>
        ) : (
          <>
            <Link href="/polls/create">
              <Button className="button-primary py-2 px-4 text-sm">Create Poll</Button>
            </Link>
            <Button
              className="button-secondary py-2 px-4 text-sm"
              onClick={logoutUser}
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
