import Image from "next/image";
import secure from "@/assets/secure.svg";
import results from "@/assets/results.svg";
import accessible from "@/assets/accessible.svg";

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center lg:mx-32 md:mx-20 mx-10 lg:my-20 md:my-20 mt-64 mb-20">
      <div>
        <h2 className="lg:text-2xl md:text-1xl text-xl text-center">
          Our Features
        </h2>
        <p className="mt-6 text-center">
          Our online polling system is designed for both serious decision-making
          and fun, ensuring a secure, transparent, and effortless voting
          experience for everyone.
        </p>
      </div>
      <div className="mt-24">
        <ul className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 px-6 pb-10 md:items-center lg:items-start">
          <div>
            <Image
              className="mx-auto py-4"
              src={secure}
              alt="animated image signifying secure"
            />
            <h3 className="font-bold text-center">Secure & Reliable</h3>
            <p className="text-sm text-center">
              Your votes are encrypted and protected for a fair polling
              experience.
            </p>
          </div>
          <div>
            <Image
              className="mx-auto py-4"
              src={results}
              alt="animated image signifying online results"
            />
            <h3 className="font-bold text-center">Real-Time Results</h3>
            <p className="text-sm text-center">
              Watch votes update instantly with dynamic visualizations.
            </p>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Image
              className="mx-auto py-4"
              src={accessible}
              alt="animated image signifying accessibility acreoss multiple devices"
            />
            <h3 className="font-bold text-center">Accessible Anywhere</h3>
            <p className="text-sm text-center">
              Vote seamlessly on any device—mobile, tablet, or desktop.
            </p>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Features;
