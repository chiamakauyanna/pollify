import { useEffect, useState } from "react";
import { getUserFromToken } from "@/services/api";
import { getAccessToken } from "@/utils/tokenManager";


export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setUser(null);
      return;
    }

    const decoded = getUserFromToken();
    setUser(decoded);
  }, []);

  return {
    user,
    isAdmin: user?.is_staff === true,
  };
};
