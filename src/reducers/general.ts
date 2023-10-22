import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const generalSlice = createSlice({
  name: "general",
  initialState: { isAdmin: true, loading: false },
  reducers: {
    setIsAdmin(state, action: PayloadAction<{ isAdmin: boolean }>) {
      state.isAdmin = action.payload.isAdmin;
    },
    setLoading(state, action: PayloadAction<{ loading: boolean }>) {
      state.loading = action.payload.loading;
    },
  },
});
