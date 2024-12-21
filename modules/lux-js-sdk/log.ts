import axios from "axios";
import { type GetLogsDir, type SubscribeLog, Level } from "./types";
import { urtConfig } from "./url";

import { getToken } from "@/utils/auth";
import { createWebsocket } from "./websocket";

export const subscribeLog: SubscribeLog = (config) => {
  const { onError, onClose, onMessage, level = Level.Info } = config;
  const url = `${urtConfig.log}?token=${getToken()}&${level}`;
  return createWebsocket(url, {
    onError,
    onMessage: (data) => {
      if (typeof data === "string") {
        const logs = JSON.parse(data.trim());
        onMessage(logs);
      }
    },
    onClose,
  });
};

export const getLogsDir: GetLogsDir = async () => {
  const res = await axios.get(`${urtConfig.logHttp}/dir`);
  return res.data.path;
};
