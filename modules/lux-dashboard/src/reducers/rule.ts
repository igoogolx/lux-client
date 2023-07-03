import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { Rule } from "lux-js-sdk";

export const rulesAdapter = createEntityAdapter<Rule>();

export const rulesSlice = createSlice({
  name: "rules",
  initialState: rulesAdapter.getInitialState(),
  reducers: {
    received(state, action: PayloadAction<{ rules: Rule[] }>) {
      rulesAdapter.setAll(state, action.payload.rules);
    },
    deleteOne(state, action: PayloadAction<{ id: string }>) {
      rulesAdapter.removeOne(state, action.payload.id);
    },
    updateOne(state, action: PayloadAction<{ rule: Rule }>) {
      rulesAdapter.updateOne(state, {
        id: action.payload.rule.id,
        changes: action.payload.rule,
      });
    },
  },
});
