import {ThemeEnum} from "@/utils/theme";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {type SettingRes} from "lux-js-sdk";
import {PROXY_MODE_ENUM} from "@/utils/constants";

const initialState: SettingRes = {
  mode: PROXY_MODE_ENUM.TUN,
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
    alwaysReset: false,
  },
  blockQuic: false,
  stack: "gvisor",
  shouldFindProcess: false,
  theme: ThemeEnum.Light,
  autoLaunch: false,
  autoConnect: false,
  sensitiveInfoMode: false,
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setSetting(_state, action: PayloadAction<SettingRes>) {
      return action.payload;
    },
  },
});
