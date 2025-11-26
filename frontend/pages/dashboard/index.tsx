import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAdmin) router.replace("/dashboard/admin");
    else router.replace("/dashboard/voter");
  }, [isAdmin]);

  return null;
}
