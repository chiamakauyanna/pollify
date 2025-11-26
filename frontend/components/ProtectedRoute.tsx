import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "../redux/store";

interface Props {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth/login"); 
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // optional: add a spinner
  }

  return <>{children}</>;
};

export default ProtectedRoute;
