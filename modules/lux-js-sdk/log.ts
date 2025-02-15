import axios from "axios";
import { type GetLogsDir, type SubscribeLog } from "./types";
import { urtConfig } from "./url";

import { getToken } from "@/utils/auth";
import { createWebsocket } from "./websocket";

export const subscribeLog: SubscribeLog = (config) => {
  const { onError, onClose, onMessage } = config;
  const url = `${urtConfig.log}?token=${getToken()}`;
  return createWebsocket(url, {
    onError,
    onMessage: (data) => {
      if (typeof data === "string") {
        let logs = JSON.parse(data.trim());
        logs = logs.map((log: string) => {
          try {
            const parsedLog = JSON.parse(log);
            if (
              "level" in parsedLog &&
              "msg" in parsedLog &&
              "time" in parsedLog
            ) {
              return parsedLog;
            }
          } catch {
            return null;
          }
          return null;
        });
        const filteredLogs = logs.filter(Boolean);
        onMessage(filteredLogs);
      }
    },
    onClose,
  });
};

export const getLogsDir: GetLogsDir = async () => {
  const res = await axios.get(`${urtConfig.logHttp}/dir`);
  return res.data.path;
};
