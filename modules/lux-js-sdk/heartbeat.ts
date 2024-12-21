import { getToken } from "@/utils/auth";
import { type SubscribePing, type SubscribeRuntimeStatus } from "./types";
import { urtConfig } from "./url";
import { createWebsocket } from "./websocket";

export const subscribePing: SubscribePing = (config) => {
  const { onError, onClose, onMessage } = config;
  const url = `${urtConfig.heartbeat}/ping?token=${getToken()}`;
  return createWebsocket(url, {
    onError,
    onMessage: (data) => {
      if (typeof data === "string") {
        onMessage(data);
      }
    },
    onClose,
  });
};

export const subscribeRuntimeStatus: SubscribeRuntimeStatus = (config) => {
  const { onError, onClose, onMessage } = config;
  const url = `${urtConfig.heartbeat}/runtime-status?token=${getToken()}`;
  return createWebsocket(url, {
    onError,
    onMessage: (data) => {
      if (typeof data === "string") {
        const runtimeStatus = JSON.parse(data);
        onMessage(runtimeStatus);
      }
    },
    onClose,
  });
};
