import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/slices/authSlice";

const withAdminAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const router = useRouter();
    const { user, token } = useSelector(selectAuth);

    useEffect(() => {
      if (!token || user?.role !== "admin") {
        router.push("/admin/login");
      }
    }, [token, user, router]);

    return token && user?.role === "admin" ? <WrappedComponent {...props} /> : null;
  };
};

export default withAdminAuth;
