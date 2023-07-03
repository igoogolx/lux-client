import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingRes } from "lux-js-sdk";

const initialState: SettingRes = {
  defaultInterface: "",
  trueProxyServer: "",
  localServer: {
    http: { enabled: false, port: 0 },
  },
  dns: {
    remote: "",
    local: "",
    boost: "",
  },
  autoMode: {
    enabled: false,
    url: "https://google.com",
    type: "url-test",
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
