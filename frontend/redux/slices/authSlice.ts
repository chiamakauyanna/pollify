import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  AuthResponse,
  RegisterData,
  LoginData,
  loginAdmin,
  loginVoter,
  registerAdmin,
  registerVoter,
} from "@/services/authService";
import { AxiosError } from "axios";

interface AuthState {
  user: AuthResponse["user"] | null;
  organization: AuthResponse["organization"] | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  organization: null,
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
export const adminLoginThunk = createAsyncThunk(
  "auth/adminLogin",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const res = await loginAdmin(data);
      return res;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Login failed"));
    }
  }
);

export const adminRegisterThunk = createAsyncThunk(
  "auth/adminRegister",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const res = await registerAdmin(data);
      return res;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Registration failed"));
    }
  }
);

// Voter
export const voterLoginThunk = createAsyncThunk(
  "auth/voterLogin",
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const res = await loginVoter(data);
      return res;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Login failed"));
    }
  }
);

export const voterRegisterThunk = createAsyncThunk(
  "auth/voterRegister",
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const res = await registerVoter(data);
      return res;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, "Registration failed"));
    }
  }
);

// Slices
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.organization = null;
      state.loading = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Admin Login
      .addCase(adminLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.organization = action.payload.organization;
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Admin Register
      .addCase(adminRegisterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminRegisterThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.organization = action.payload.organization;
      })
      .addCase(adminRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Voter Login
      .addCase(voterLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(voterLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.organization = action.payload.organization;
      })
      .addCase(voterLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Voter Register
      .addCase(voterRegisterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(voterRegisterThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.organization = action.payload.organization;
      })
      .addCase(voterRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
