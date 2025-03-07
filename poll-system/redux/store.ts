import { configureStore } from "@reduxjs/toolkit";
import pollReducer from "@/redux/slices/pollSlice";
import userReducer from "@/redux/slices/userSlice";
import resultReducer from "@/redux/slices/resultSlice";
import authReducer from "@/redux/slices/authSlice";
import adminReducer from "@/redux/slices/adminSlice";

export const store = configureStore({
  reducer: {
    polls: pollReducer,
    user: userReducer,
    results: resultReducer,
    auth: authReducer,
    admin: adminReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
