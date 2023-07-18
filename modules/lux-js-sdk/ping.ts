import axios from "axios";
import { Ping } from "./types";
import { urtConfig } from "./url";

export const ping: Ping = async () => {
  const url = urtConfig.ping;
  await axios.get(url);
};
