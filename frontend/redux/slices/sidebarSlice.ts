import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store"; 

// Initial State
const initialState = {
  isOpen: false, 
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen; 
    },
  },
});

export const { toggleSidebar } = sidebarSlice.actions;

// Selector
export const selectSidebarState = (state: RootState) => state.sidebar.isOpen;

export default sidebarSlice.reducer;
