import { configureStore } from "@reduxjs/toolkit";
import pollReducer from "@/redux/slices/pollSlice";
import sidebarReducer from "@/redux/slices/sidebarSlice";

export const store = configureStore({
  reducer: {
    polls: pollReducer,
    sidebar: sidebarReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
