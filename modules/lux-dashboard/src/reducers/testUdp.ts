import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

type TestUdpData = { loading?: boolean; result?: boolean; id: string };

export const testUdp = createEntityAdapter<TestUdpData>();

export const testUdpSlice = createSlice({
  name: "testUdp",
  initialState: testUdp.getInitialState(),
  reducers: {
    deleteOne(state, action: PayloadAction<{ id: string }>) {
      testUdp.removeOne(state, action.payload.id);
    },
    updateOne(
      state,
      action: PayloadAction<{
        data: TestUdpData;
      }>
    ) {
      testUdp.upsertOne(state, action.payload.data);
    },
  },
});
