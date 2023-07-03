import axios from "axios";
import { urtConfig } from "./url";
import {
  CloseAllConnections,
  CloseConnection,
  SubscribeConnections,
} from "./types";
import { createWebsocket } from "./websocket";

export const subscribeConnections: SubscribeConnections = (config) => {
  const { onError, onClose, onMessage } = config;
  const url = `${urtConfig.wsConnection}`;
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
