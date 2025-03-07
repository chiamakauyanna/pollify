import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  name: string;
  role: "admin" | "voter";
  isAuthenticated: boolean;
}

const initialState: User = {
  id: "",
  name: "",
  role: "voter",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.id = "";
      state.name = "";
      state.role = "voter";
      state.isAuthenticated = false;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
