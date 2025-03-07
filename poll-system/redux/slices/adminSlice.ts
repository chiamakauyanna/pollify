import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { Admin, AdminState } from "@/Interfaces/interface";

const initialState: AdminState = {
  admins: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmins: (state, action: PayloadAction<Admin[]>) => {
      state.admins = action.payload;
    },
    addAdmin: (state, action: PayloadAction<Admin>) => {
      state.admins.push(action.payload);
    },
    removeAdmin: (state, action: PayloadAction<number>) => {
      state.admins = state.admins.filter(admin => admin.id !== action.payload);
    },
    updateAdmin: (state, action: PayloadAction<Admin>) => {
      const index = state.admins.findIndex(admin => admin.id === action.payload.id);
      if (index !== -1) {
        state.admins[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAdmins, addAdmin, removeAdmin, updateAdmin, setLoading, setError } = adminSlice.actions;
export const selectAdmins = (state: RootState) => state.admin.admins;
export default adminSlice.reducer;
