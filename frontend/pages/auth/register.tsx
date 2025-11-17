import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import Toast from "@/components/common/Toast";
import RegisterForm from "./components/RegisterForm";

const RegisterPage = () => {
  const { registerAdmin, registerVoter, error, user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const handleToggle = (role: "admin" | "voter") => setIsAdmin(role === "admin");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg space-y-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">Create an Account</h1>

          {/* Role toggle */}
          <div className="flex justify-center gap-2">
            {["admin", "voter"].map((role) => (
              <button
                key={role}
                onClick={() => handleToggle(role as "admin" | "voter")}
                className={`px-5 py-2 rounded-lg font-medium transition-colors ${
                  (isAdmin && role === "admin") || (!isAdmin && role === "voter")
                    ? "bg-primary text-white hover:bg-secondary"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          <RegisterForm onSubmit={isAdmin ? registerAdmin : registerVoter} />

          {error && <Toast message={error} type="error" />}

          {/* Already have an account link */}
          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
