import Link from "next/link";
import Button from "@/components/common/Button";

const LoginSelection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-background text-text px-6">
      <h1 className="text-3xl font-bold mb-4 text-primary">
        Welcome Back to Pollify
      </h1>
      <p className="text-lg text-secondary mb-8">
        Choose your login type to access your account.
      </p>

      <div className="flex gap-6 justify-center md:flex-col flex-col lg:flex-row mt-6">
        <div className="bg-white shadow-lg p-6 rounded-lg text-center w-80">
          <h2 className="text-xl font-semibold text-primary">Admin Login</h2>
          <p className="text-sm text-gray-600 mt-2">
            Manage polls, oversee voting, and track results.
          </p>
          <Link href="/login/admin">
            <Button
              text="Login as Admin"
              className="mt-4 w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-hover"
            />
          </Link>
        </div>

        <div className="bg-white shadow-lg p-6 rounded-lg text-center w-80">
          <h2 className="text-xl font-semibold text-secondary">Voter Login</h2>
          <p className="text-sm text-gray-600 mt-2">
            Cast votes securely and view live results.
          </p>
          <Link href="/login/voter">
            <Button
              text="Login as Voter"
              className="mt-4 w-full py-2 px-4 bg-secondary text-white rounded-lg hover:bg-primary"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

LoginSelection.noLayout = true;

export default LoginSelection;
