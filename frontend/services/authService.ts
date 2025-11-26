import api, { getUserFromToken } from "./api";
import { setTokens } from "../utils/tokenManager";

// Types
export interface LoginData {
  username: string;
  password: string;
}

// Login
export const login = async (data: { username: string; password: string }) => {
  const res = await api.post("/token/", data);

  setTokens(res.data);

  const decoded = getUserFromToken(); 

  return {
    ...res.data,
    user: {
      username: decoded?.username || "",
      is_staff: decoded?.is_staff === true,
    },
  };
};
