import axios from "axios";
import { GetVersion } from "./types";
import { urtConfig } from "./url";

export const getVersion: GetVersion = async () => {
  const url = `${urtConfig.version}`;
  const res = await axios.get(url);
  return res.data;
};
