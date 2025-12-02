import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, LoginData } from "../../services/authService";
import { AxiosError } from "axios";
import { clearTokens } from "../../utils/tokenManager";

interface AuthState {
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  loading: false,
  error: null,
};

// ----------------------------
// Helpers
// ----------------------------

export const extractErrorMessage = (err: unknown, fallback: string) => {
  if (err instanceof AxiosError && err.response?.data) {
    return err.response.data.detail || fallback;
  }
  return fallback;
};

// Admin
export const LoginThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const res = await login(data);
      return true;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Login failed"));
    }
  }
);

// Slices
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      clearTokens();
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(LoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(LoginThunk.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(LoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
