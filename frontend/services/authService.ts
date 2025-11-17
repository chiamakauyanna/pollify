import api from "./api";
import { setTokens } from "../utils/tokenManager";

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  voter_id?: string;
  unique_id?: string;
}

export interface Organization {
  id: string;
  name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
  organization: Organization | null;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  username: string;
  password: string;
}

// Helpers
const handleAuth = (res: { data: AuthResponse }) => {
  if (res.data.access) setTokens(res.data);
  return res.data;
};

// Registration
export const registerAdmin = async (data: RegisterData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/register/admin/", data);
  return handleAuth(res);
};

export const registerVoter = async (data: RegisterData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/register/voter/", data);
  return handleAuth(res);
};

// Login
export const loginAdmin = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login/admin/", data);
  return handleAuth(res);
};

export const loginVoter = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/auth/login/voter/", data);
  return handleAuth(res);
};
