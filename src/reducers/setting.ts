import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type SettingRes } from "lux-js-sdk";

const initialState: SettingRes = {
  mode: "tun",
  language: "en-US",
  defaultInterface: "",
  localServer: {
    allowLan: false,
    port: 0,
  },
  dns: {
    disableCache: false,
    server: {
      boost: [],
      local: [],
      remote: [],
    },
    customizedOptions: [],
  },
  autoMode: {
    enabled: false,
    url: "",
    type: "url-test",
  },
  hijackDns: {
    enabled: true,
    networkService: "",
  },
  blockQuic: false,
  stack: "gvisor",
  shouldFindProcess: false,
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setSetting(state, action: PayloadAction<SettingRes>) {
      return action.payload;
    },
  },
});
