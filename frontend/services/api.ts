import axios from "axios";
import { getAccessToken, setTokens, clearTokens } from "../utils/tokenManager";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "./tokenService";

export interface DecodedUser {
  username: string;
  is_staff: boolean;
  exp?: number;
  iat?: number;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Attach Access Token to every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 → refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const data = await refreshToken();
        setTokens(data);
        originalRequest.headers.Authorization = `Bearer ${data.access}`;

        return api(originalRequest);
      } catch {
        clearTokens();
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

// Decode JWT → get user payload
export const getUserFromToken = () => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    return jwtDecode<DecodedUser>(token);
  } catch {
    return null;
  }
};

export default api;
