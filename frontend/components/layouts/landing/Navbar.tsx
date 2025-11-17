import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { user, logoutUser } = useAuth();

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link href="/">
        <p className="text-primary font-bold text-xl">Pollify</p>
      </Link>

      <div className="space-x-4">
        {user ? (
          <>
            <span className="text-secondary-text">{user.username}</span>
            <button
              onClick={logoutUser}
              className="button-secondary px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/auth/login">
            <p className="button-primary px-3 py-1 rounded">Login</p>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
