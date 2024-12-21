import { getToken } from "@/utils/auth";
import axios from "axios";
import {
  type CloseAllConnections,
  type CloseConnection,
  type SubscribeConnections,
} from "./types";
import { urtConfig } from "./url";
import { createWebsocket } from "./websocket";

const INTERVAL = 3000;
export const subscribeConnections: SubscribeConnections = (config) => {
  const { onError, onClose, onMessage } = config;
  const url = `${urtConfig.wsConnection}?token=${getToken()}&interval=${INTERVAL}`;
  return createWebsocket(url, {
    onError,
    onMessage: (data) => {
      if (typeof data === "string") {
        const connections = JSON.parse(data);
        onMessage(connections);
      }
    },
    onClose,
  });
};

export const closeConnection: CloseConnection = async ({ id }) => {
  await axios.delete(`${urtConfig.connection}/${id}`);
};

export const closeAllConnections: CloseAllConnections = async () => {
  await axios.delete(`${urtConfig.connection}`);
};
