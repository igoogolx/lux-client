import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const generalSlice = createSlice({
  name: "general",
  initialState: { isAdmin: true },
  reducers: {
    setIsAdmin(state, action: PayloadAction<{ isAdmin: boolean }>) {
      state.isAdmin = action.payload.isAdmin;
    },
  },
});
