import axios from "axios";
import { GetRuntimeDetail, GetRuntimeOS } from "./types";
import { urtConfig } from "./url";

export const getRuntimeDetail: GetRuntimeDetail = async () => {
  const url = `${urtConfig.runtimeDetail}`;
  const res = await axios.get(url);
  return res.data;
};

export const getRuntimeOS: GetRuntimeOS = async () => {
  const url = `${urtConfig.runtimeDetail}/os`;
  const res = await axios.get(url);
  return res.data;
};
