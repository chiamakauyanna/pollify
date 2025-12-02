import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";

interface Props {
  children: React.ReactNode;
}

interface DecodedUser {
  username: string;
  is_staff: boolean;
  exp?: number;
  iat?: number;
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      router.replace("/auth/login");
      return;
    }

    try {
      const decoded = jwtDecode<DecodedUser>(token);

      if (!decoded.is_staff) {
        router.replace("/auth/login");
        return;
      }

      setVerified(true);
    } catch {
      router.replace("/auth/login");
    }
  }, [router]);

  if (!verified) return null;

  return <>{children}</>;
}
