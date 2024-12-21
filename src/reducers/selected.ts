import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export const selectedSlice = createSlice({
  name: "selected",
  initialState: { proxy: "", rule: "" },
  reducers: {
    setProxy(state, action: PayloadAction<{ id: string }>) {
      state.proxy = action.payload.id;
    },
    setRule(state, action: PayloadAction<{ id: string }>) {
      state.rule = action.payload.id;
    },
  },
});
