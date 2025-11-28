import Button from "@/components/common/Button";
import Image from "next/image";
import Steps from "@/components/landingSection/Steps";
import Features from "@/components/landingSection/Features";
import Link from "next/link";
import Header from "@/components/layouts/landing/Header";
import Footer from "@/components/layouts/landing/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <section className="">
        <div className="flex lg:gap-12 md:gap-3 gap-8 lg:px-12 md:px-10 px-8 justify-center h-screen items-center relative lg:flex-row md:flex-row flex-col">
          <div className="lg:p-6 md:p-6 p-2 lg:mr-24 ">
            <div className="max-w-md">
              <h2 className="text-primary lg:text-3xl md:text-2xl text-xl mb-4 font-bold md:text-left text-center">
                Revolutionizing Online Polling
              </h2>
              <p className="text-sm md:text-base font-semibold md:text-left text-center">
                Fast, secure, and interactive polling at your fingertips. Have
                your say and watch results update live!
              </p>
            </div>
            <div className="text-center md:text-left lg:text-left">
              <Link href="/dashboard/admin">
                <Button className="button-primary py-3 px-8 mt-4 font-medium">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:flex md:flex shadow-lg p-2 shadow-primary">
            <Image
              src="/images/voting-img.svg"
              alt="animated picture of a lady voting"
              width={300}
              height={300}
              className="md:w-96 xl:w-[450px] h-auto"
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
