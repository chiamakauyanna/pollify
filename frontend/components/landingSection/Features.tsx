import Image from "next/image";

const Features = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center lg:mx-32 md:mx-20 mx-10 my-24">
      
      <div>
        <h2 className="text-center text-2xl md:text-3xl font-bold text-primary">
          Powerful Features for Smooth Polling
        </h2>
        <p className="mt-4 text-center text-sm md:text-base text-gray-600">
          Pollify gives you the tools to run secure, seamless, and engaging polls.
        </p>
      </div>

      <div className="mt-16">
        <ul className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-10">
          
          {/* Feature 1 */}
          <li className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <Image
              src="/images/secure.svg"
              alt="Secure and reliable voting"
              width={220}
              height={220}
              className="mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg text-primary">Secure & Reliable</h3>
            <p className="text-sm text-gray-600 mt-2">
              Each vote link is unique and encrypted, preventing duplicate votes and ensuring fairness.
            </p>
          </li>

          {/* Feature 2 */}
          <li className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <Image
              src="/images/results.svg"
              alt="Live real-time analytics"
              width={220}
              height={220}
              className="mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg text-primary">Live Results</h3>
            <p className="text-sm text-gray-600 mt-2">
              Track votes instantly with real-time updates and clear vote breakdowns.
            </p>
          </li>

          {/* Feature 3 */}
          <li className="bg-white p-6 rounded-2xl shadow-sm border border-primary/10 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 md:col-span-2 lg:col-span-1">
            <Image
              src="/images/accessible.svg"
              alt="Admin friendly controls"
              width={200}
              height={200}
              className="mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg text-primary">Admin Dashboard Control</h3>
            <p className="text-sm text-gray-600 mt-2">
              Easily create, update, and delete polls, assign choices, and monitor analytics — all from a clean dashboard.
            </p>
          </li>

        </ul>
      </div>
    </section>
  );
};

export default Features;
