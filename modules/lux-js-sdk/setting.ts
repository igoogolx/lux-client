import axios from "axios";
import {
  type GetConfigFileDir,
  type GetSetting,
  type GetSettingInterfaces,
  type OpenConfigFileDir,
  type ResetConfig,
  type SetSetting,
} from "./types";
import { urtConfig } from "./url";

export const getSetting: GetSetting = async () => {
  const url = `${urtConfig.setting}`;
  const res = await axios.get(url);
  return res.data.setting;
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

export const openConfigFileDir: OpenConfigFileDir = async () => {
  await axios.get(`${urtConfig.setting}/open-config-file-dir`);
};

export const resetConfigFile: ResetConfig = async () => {
  await axios.put(`${urtConfig.setting}/reset-config`);
};
