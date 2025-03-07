import { configureStore } from "@reduxjs/toolkit";
import pollReducer from "@/redux/slices/pollSlice";
import resultReducer from "@/redux/slices/resultSlice";
import sidebarReducer from "@/redux/slices/sidebarSlice";

export const store = configureStore({
  reducer: {
    polls: pollReducer,
    results: resultReducer,
    sidebar: sidebarReducer,
  },
});

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
