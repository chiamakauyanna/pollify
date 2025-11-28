import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "../redux/store";
import Loader from "./common/Loader";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {
    if (typeof isAuthenticated === "boolean" && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === undefined) return <Loader />; // waiting for hydration
  if (!isAuthenticated) return null; // redirecting

  return <>{children}</>;
};

export default ProtectedRoute;
