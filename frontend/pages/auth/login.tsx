import { useEffect } from "react";
import { useRouter } from "next/router";
import LoginForm from "./components/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { LoginThunk } from "../../redux/slices/authSlice";
import { RootState, AppDispatch } from "../../redux/store";
import Toast from "../../components/common/Toast";

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard/admin");
    }
  }, [isAuthenticated, router]);

  // Handle form submission
  const handleLogin = async (data: { username: string; password: string }) => {
    const result = await dispatch(LoginThunk(data));
    if (LoginThunk.fulfilled.match(result)) {
      router.replace("/dashboard/admin");
    }
  };

  // While checking auth or redirecting
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="relative h-screen w-full">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg7.jpg')" }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Form Container */}
      <main className="relative z-10 flex flex-col justify-center items-center h-full px-4">
        <div className="w-full max-w-lg bg-gray-100/70 p-8 rounded-xl shadow-lg space-y-6">
          <p className="text-xl md:text-2xl font-semibold text-black px-1">
            Login
          </p>

          <LoginForm onSubmit={handleLogin} loading={loading} />

          {error && <Toast message={error} type="error" />}
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
