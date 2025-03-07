import Button from "@/components/common/Button";
import Image from "next/image";
import homeImg from "@/assets/images/voting-img.svg";
import Steps from "@/components/Steps";
import Features from "@/components/Features";
import Link from "next/link";

export default function Home() {
  return (
    <section className="">
      <div className="flex lg:gap-12 md:gap-10 lg:px-12 md:px-10 px-8 justify-center h-screen items-center relative">
        <div className="lg:p-6 md:p-6 p-2 lg:mr-24 ">
          <div>
            <h2 className="text-primary lg:text-3xl md:text-2xl text-xl mb-4 font-bold lg:text-left md:text-left text-center">
              Revolutionizing Online Polling
            </h2>
            <p className="text-sm lg:text-left md:text-left text-center">
              Fast, secure, and interactive polling at your fingertips.
              Have your say and watch results update live!
            </p>
          </div>
          <div className="flex gap-4 text-sm mt-6 items-center lg:justify-start md:justify-start justify-center">
            <Link href="/register/admin">
              <Button text="Register as Admin" className="button-primary lg:text-lg md:text-sm text-xs py-3" />
            </Link>
            <Link href="/register/voter">
              <Button text="Register as Voter" className="button-primary lg:text-lg md:text-sm text-xs py-3" />
            </Link>
          </div>
        </div>
        <div className="lg:flex md:flex hidden">
          <Image
            src={homeImg}
            alt="animated picture of a lady voting"
            className="w-[300px]"
          />
        </div>
      </div>
      <Steps />
      <Features />
    </section>
  );
}
