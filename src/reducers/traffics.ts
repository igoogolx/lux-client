import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Traffic } from "lux-js-sdk";

const INIT_STATE: { now: Traffic[]; total: Traffic | null } = {
  now: [],
  total: null,
};

const MAX_NOW_NUM = 60; // 1 min

export const trafficsSlice = createSlice({
  name: "traffics",
  initialState: INIT_STATE,
  reducers: {
    addNow(state, action: PayloadAction<{ traffic: Traffic }>) {
      state.now = [...state.now, action.payload.traffic].slice(-MAX_NOW_NUM);
    },
    setTotal(state, action: PayloadAction<{ traffic: Traffic }>) {
      state.total = action.payload.traffic;
    },
  },
});
