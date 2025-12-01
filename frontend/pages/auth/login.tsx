import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import LoginForm from "./components/LoginForm";
import { LoginThunk } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import Toast from "../../components/common/Toast";
import Image from "next/image";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (data: { username: string; password: string }) => {
    const result = await dispatch(LoginThunk(data));
    if (LoginThunk.fulfilled.match(result)) {
      router.replace("/dashboard");
    }
  };

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT SIDE IMAGE */}
      <div className="relative hidden lg:block">
        <Image
          src="/images/bg.jpg"
          alt="Background"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay for better contrast */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* RIGHT SIDE FORM */}
      <div className="flex items-center justify-center px-6 py-16 bg-primary/10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-2xl p-10 rounded-3xl border border-gray-200/40">
          {/* Logo or title */}
          <h1 className="text-1xl md:text-2xl lg:text-4xl font-bold mb-6 text-center text-primary">
            Sign in
          </h1>
          <p className="text-center text-secondary-text mb-8">
            Enter your credentials to access your account
          </p>

          {/* Login Form */}
          <LoginForm onSubmit={handleLogin} loading={loading} />

          {/* Error Toast */}
          {error && (
            <div className="mt-6">
              <Toast message={error} type="error" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
