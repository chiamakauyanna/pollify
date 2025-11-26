import axios from "axios";
import { getRefreshToken, setTokens } from "../utils/tokenManager";

const API_URL = process.env.VITE_BASE_URL;

export const refreshToken = async () => {
  const refresh = getRefreshToken();
  const response = await axios.post(`${API_URL}/token/refresh/`, { refresh });
  setTokens(response.data);
  return response.data;
};
