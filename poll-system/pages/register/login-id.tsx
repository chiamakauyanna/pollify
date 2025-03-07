import Link from "next/link";
import Button from "@/components/common/Button";

const LoginIDNotification = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-background text-text px-6">
      <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-lg text-center">
        <h2 className="text-2xl font-bold text-primary mb-4">
          Check Your Email!
        </h2>
        <p className="text-gray-700">
          Your login ID number has been sent to your email address. Please check your inbox and use the ID to sign in.
        </p>
        <p className="text-sm text-gray-600 mt-6">
          Didn’t receive the email? Check your spam folder or{" "}
          <Link href="/resend-login-id" className="text-secondary font-semibold">
            resend login ID.
          </Link>
        </p>
        <Button
          text="Go to Login"
          className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-hover mt-6"
          onClick={() => (window.location.href = "/login")}
        />
      </div>
    </section>
  );
};

LoginIDNotification.noLayout = true;

export default LoginIDNotification;
