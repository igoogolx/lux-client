import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Traffic } from "lux-js-sdk";

const INIT_STATE: { now: Traffic["speed"][]; total: Traffic["total"] | null } =
  {
    now: [],
    total: null,
  };

const MAX_NOW_NUM = 60; // 1 min

export const trafficsSlice = createSlice({
  name: "traffics",
  initialState: INIT_STATE,
  reducers: {
    addNow(state, action: PayloadAction<{ traffic: Traffic["speed"] }>) {
      state.now = [...state.now, action.payload.traffic].slice(-MAX_NOW_NUM);
    },
    setTotal(state, action: PayloadAction<{ traffic: Traffic["total"] }>) {
      state.total = action.payload.traffic;
    },
  },
});
