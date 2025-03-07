import Link from "next/link";

const NavBar = () => {
  return (
    <ul className="flex lg:gap-10 md:gap-6 lg:text-lg md:text-base">
      <Link href="/">
        <li className="">Home</li>
      </Link>
      <Link href="/about">
        <li className="">About</li>
      </Link>
      <Link href="/contact">
        <li className="">Contact Us</li>
      </Link>
    </ul>
  );
};

export default NavBar;
