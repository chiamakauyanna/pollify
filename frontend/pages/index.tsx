import Button from "@/components/common/Button";
import Image from "next/image";
import homeImg from "@/assets/voting-img.svg"
import Steps from "@/components/Steps";
import Features from "@/components/Features";
import Link from "next/link";
import Header from "@/components/layout/LandingHeader";
import Footer from "@/components/layout/LandingFooter";

export default function Home() {
  return (
    <>
      <Header />
      <section className="">
        <div className="flex lg:gap-12 md:gap-10 gap-8 lg:px-12 md:px-10 px-8 justify-center h-screen items-center relative lg:flex-row md:flex-row flex-col-reverse">
          <div className="lg:p-6 md:p-6 p-2 lg:mr-24 ">
            <div className="max-w-md">
              <h2 className="text-primary lg:text-3xl md:text-2xl text-xl mb-4 font-bold lg:text-left md:text-left text-center">
                Revolutionizing Online Polling
              </h2>
              <p className="text-sm lg:text-left md:text-left text-center">
                Fast, secure, and interactive polling at your fingertips. Have
                your say and watch results update live!
              </p>
            </div>
            <div className="text-center md:text-left lg:text-left">
              <Link href="/dashboard">
                <Button className="button-primary lg:text-sm md:text-sm text-xs py-3 px-4 mt-4">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:flex md:flex">
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
      <Footer />
    </>
  );
}

Home.noLayout = true;
