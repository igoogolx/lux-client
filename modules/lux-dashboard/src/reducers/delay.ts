import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Delay } from "lux-js-sdk";

export type DelayInfo = Pick<Delay, "id"> & {
  loading?: boolean;
};

export const delaysAdapter = createEntityAdapter<DelayInfo>();

export const delaysSlice = createSlice({
  name: "delays",
  initialState: delaysAdapter.getInitialState(),
  reducers: {
    received(state, action: PayloadAction<{ delays: DelayInfo[] }>) {
      delaysAdapter.setAll(state, action.payload.delays);
    },
    deleteOne(state, action: PayloadAction<{ id: string }>) {
      delaysAdapter.removeOne(state, action.payload.id);
    },
    updateOne(state, action: PayloadAction<{ delay: DelayInfo }>) {
      delaysAdapter.upsertOne(state, action.payload.delay);
    },
  },
});
