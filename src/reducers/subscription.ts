import {
  createEntityAdapter,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { type BaseProxy, Subscription } from "lux-js-sdk";

export const subscriptionsAdapter = createEntityAdapter<Subscription>();

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState: subscriptionsAdapter.getInitialState(),
  reducers: {
    received(state, action: PayloadAction<{ subscriptions: Subscription[] }>) {
      subscriptionsAdapter.setAll(state, action.payload.subscriptions);
    },
    deleteOne(state, action: PayloadAction<{ id: string }>) {
      subscriptionsAdapter.removeOne(state, action.payload.id);
    },
    deleteMany(state, action: PayloadAction<{ ids: string[] }>) {
      subscriptionsAdapter.removeMany(state, action.payload.ids);
    },
    updateOne(
      state,
      action: PayloadAction<{ proxy: Partial<BaseProxy> & { id: string } }>,
    ) {
      subscriptionsAdapter.updateOne(state, {
        id: action.payload.proxy.id,
        changes: action.payload.proxy,
      });
    },
    addMany(state, action: PayloadAction<{ subscriptions: Subscription[] }>) {
      subscriptionsAdapter.addMany(state, action.payload.subscriptions);
    },
    addOne(state, action: PayloadAction<{ proxy: Subscription }>) {
      subscriptionsAdapter.addOne(state, action.payload.proxy);
    },
    deleteAll(state) {
      subscriptionsAdapter.removeAll(state);
    },
  },
});
