import axios from "axios";
import {
  type GetConfigFileDir,
  type GetSetting,
  type GetSettingInterfaces,
  type ResetConfig,
  type SetSetting,
  SettingRes,
} from "./types";
import { urtConfig } from "./url";

export const getSetting: GetSetting = async () => {
  const url = `${urtConfig.setting}`;
  const res = await axios.get(url);
  const newSetting = res.data.setting as SettingRes;

  //TODO: remove in v2
  newSetting.autoConnect = !!newSetting.autoConnect;
  newSetting.blockQuic = !!newSetting.blockQuic;
  newSetting.autoLaunch = !!newSetting.autoLaunch;
  newSetting.shouldFindProcess = !!newSetting.shouldFindProcess;
  newSetting.hijackDns.alwaysReset = !!newSetting.hijackDns.alwaysReset;
  return newSetting;
};

export const getSettingInterfaces: GetSettingInterfaces = async () => {
  const url = `${urtConfig.setting}/interfaces`;
  const res = await axios.get(url);
  return res.data.interfaces;
};

export const setSetting: SetSetting = async (data) => {
  const url = `${urtConfig.setting}`;
  await axios.put(url, data);
};

export const getConfigFileDir: GetConfigFileDir = async () => {
  const res = await axios.get(`${urtConfig.setting}/config-file-dir-path`);
  return res.data.path;
};

export const getExecutablePath: GetConfigFileDir = async () => {
  const res = await axios.get(`${urtConfig.setting}/executable-path`);
  return res.data.path;
};

export const resetConfigFile: ResetConfig = async () => {
  await axios.put(`${urtConfig.setting}/reset-config`);
};
