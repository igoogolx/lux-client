import { subscriptionsSlice } from "@/reducers/subscription";
import { configureStore } from "@reduxjs/toolkit";
import { delaysSlice } from "./delay";
import { generalSlice } from "./general";
import { managerSlice } from "./manager";
import { proxiesSlice } from "./proxy";
import { rulesSlice } from "./rule";
import { selectedSlice } from "./selected";
import { settingSlice } from "./setting";
import { testUdpSlice } from "./testUdp";

export const store = configureStore({
  reducer: {
    proxies: proxiesSlice.reducer,
    selected: selectedSlice.reducer,
    rules: rulesSlice.reducer,
    delays: delaysSlice.reducer,
    manager: managerSlice.reducer,
    setting: settingSlice.reducer,
    general: generalSlice.reducer,
    testUdp: testUdpSlice.reducer,
    subscriptions: subscriptionsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
