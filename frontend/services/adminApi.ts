import axios from "axios";
import { getAccessToken, setTokens, clearTokens } from "../utils/tokenManager";
import { refreshToken } from "./tokenService";

const adminApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach token
adminApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh on 401
adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const data = await refreshToken();
        setTokens(data);
        original.headers.Authorization = `Bearer ${data.access}`;
        return adminApi(original);
      } catch {
        clearTokens();
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;
