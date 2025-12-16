import Button from "@/components/common/Button";
import Image from "next/image";
import Steps from "@/components/landingSection/Steps";
import Features from "@/components/landingSection/Features";
import Link from "next/link";
import Header from "@/components/layouts/landing/Header";
import Footer from "@/components/layouts/landing/Footer";
import UseCase from "@/components/landingSection/UseCase";
import CTA from "@/components/landingSection/CTA";
import FAQ from "@/components/landingSection/FAQ";

export default function Home() {
  return (
    <>
      <Header />
      <section className="">
        <div className="flex lg:gap-12 gap-16 lg:px-10 md:px-12 px-8 h-full lg:h-screen justify-center items-center relative lg:flex-row flex-col md:py-32">
          {/* Left Content */}
          <div className="max-w-lg lg:text-left text-center mt-32 md:mt-0">
            <p className="lg:text-5xl md:text-4xl text-3xl font-bold mb-4 leading-tight">
              Create Secure Polls in Seconds with{" "}
              <span className="text-primary">Pollify</span>
            </p>
            <p className="text-sm md:text-base font-medium">
              Simple, secure, and real-time polling for teams, schools,
              communities, and online groups. No sign-up required for voters.
            </p>

            <div className="mt-6 md:mt-12">
              <Link href="/auth/login">
                <Button className="button-primary py-3 px-8">
                  Create Poll
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex flex-row rounded-xl gap-4 items-center">
            <Image
              src="/screenshots/pollify_dashboard.png"
              alt="Illustration of online polling"
              width={250}
              height={250}
              className="md:w-[400px] xl:w-[550px] h-auto shadow-lg shadow-primary"
              loading="eager"
            />
            <Image
              src="/screenshots/pollify_details.png"
              alt="Illustration of online polling"
              width={100}
              height={100}
              className="w-18 md:w-[150px] xl:w-[155px] md:h-[150px] h-[120px] shadow-lg shadow-primary -ml-6"
              loading="eager"
            />
          </div>
        </div>
        <Steps />
        <Features />
        <UseCase />
        <CTA />
        <FAQ />
      </section>
      <Footer />
    </>
  );
}
