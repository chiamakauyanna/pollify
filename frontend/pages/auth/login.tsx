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
    <div className="relative h-screen w-full">
      <div className="absolute inset-0">
        <Image
          src="/images/bg7.jpg"
          alt="Background Image"
          fill
          priority
          className="bg-cover bg-center"
        />
      </div>
      <div className="absolute inset-0 bg-black/50" />
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
