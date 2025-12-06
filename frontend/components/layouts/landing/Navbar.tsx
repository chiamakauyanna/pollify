import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link href="/">
        <p className="text-primary font-bold text-xl">Pollify</p>
      </Link>

      <div className="space-x-4">
          <Link href="/auth/login">
            <p className="button-primary px-3 py-1 rounded">Get Started</p>
          </Link>
      </div>
    </nav>
  );
};

export default Navbar;
