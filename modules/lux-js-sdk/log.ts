import axios from "axios";
import { urtConfig } from "./url";
import { GetLogsDir, SubscribeLog, Level } from "./types";

import { createWebsocket } from "./websocket";

export const subscribeLog: SubscribeLog = (config) => {
  const { onError, onClose, onMessage, level = Level.Info } = config;
  const url = `${urtConfig.log}?${level}`;
  return createWebsocket(url, {
    onError,
    onMessage: (data) => {
      if (typeof data === "string") {
        const logs = JSON.parse(data);
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
