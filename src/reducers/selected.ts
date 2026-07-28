import { LOCAL_SERVERS } from "@/utils/constants";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { BaseProxy } from "lux-js-sdk";

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
  selectors: {
    getSelectedCardId(state, proxies: BaseProxy[]) {
      const proxy = proxies.find((p) => p.id === state.proxy);
      if (!proxy) {
        return null;
      }
      if (proxy.subscription) {
        return proxy.subscription;
      }
      return LOCAL_SERVERS;
    },
  },
});
