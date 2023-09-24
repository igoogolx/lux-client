import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingRes } from "lux-js-sdk";

const initialState: SettingRes = {
  defaultInterface: "",
  localServer: {
    http: { enabled: false, port: 0 },
  },
  dns: {
    remote: {
      type: "builtIn",
      value: "",
    },
    local: {
      type: "builtIn",
      value: "",
    },
    boost: {
      type: "builtIn",
      value: "",
    },
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
