import { configureStore } from "@reduxjs/toolkit";
import { delaysSlice } from "./delay";
import { generalSlice } from "./general";
import { loggerSlice } from "./logger";
import { managerSlice } from "./manager";
import { proxiesSlice } from "./proxy";
import { rulesSlice } from "./rule";
import { selectedSlice } from "./selected";
import { settingSlice } from "./setting";
import { testUdpSlice } from "./testUdp";
import { trafficsSlice } from "./traffics";

export const store = configureStore({
  reducer: {
    proxies: proxiesSlice.reducer,
    selected: selectedSlice.reducer,
    rules: rulesSlice.reducer,
    delays: delaysSlice.reducer,
    traffics: trafficsSlice.reducer,
    manager: managerSlice.reducer,
    setting: settingSlice.reducer,
    logger: loggerSlice.reducer,
    general: generalSlice.reducer,
    testUdp: testUdpSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
