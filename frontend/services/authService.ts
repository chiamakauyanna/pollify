import adminApi from "./adminApi";
import { setTokens } from "../utils/tokenManager";

// Types
export interface LoginData {
  username: string;
  password: string;
}

// Login
export const login = async (data: { username: string; password: string }) => {
  const res = await adminApi.post("/token/", data);
  setTokens(res.data);
  return { ...res.data };
};

