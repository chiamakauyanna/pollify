import Button from "@/components/common/Button";
import Link from "next/link";

const RegisterSelection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-background text-text px-6">
      <h1 className="text-3xl font-bold mb-4 text-primary">
        Welcome to Pollify
      </h1>
      <p className="text-lg text-secondary mb-8">
        Choose how you&apos;d like to register and start using our secure online
        voting system.
      </p>

      <div className="flex gap-6 justify-center md:flex-col flex-col lg:flex-row mt-6">
        {/* Admin Registration Card */}
        <div className="bg-white shadow-lg p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-primary">
            Register as an Admin
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Create and manage polls, oversee voting sessions, and track
            real-time results.
          </p>
          <Link href="/register/admin">
            <Button
              text="Register as Admin"
              className="mt-4 w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-hover"
            />
          </Link>
        </div>

        {/* Voter Registration Card */}
        <div className="bg-white shadow-lg p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-secondary">
            Register as a Voter
          </h2>
          <p className="text-sm text-gray-600 mt-2">
            Participate in polls, cast your votes securely, and view live
            results.
          </p>
          <Link href="/register/voter">
            <Button
              text="Register as Voter"
              className="mt-4 w-full py-2 px-4 bg-secondary text-white rounded-lg hover:bg-primary"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

RegisterSelection.noLayout = true;

export default RegisterSelection;
