import { SubscribePing } from "./types";
import { urtConfig } from "./url";
import { createWebsocket } from "./websocket";

export const subscribePing: SubscribePing = (config) => {
  const { onError, onClose, onMessage } = config;
  const url = `${urtConfig.wsPing}`;
  return createWebsocket(url, {
    onError,
    onMessage: (data) => {
      if (typeof data === "string") {
        const msg = JSON.parse(data);
        onMessage(msg);
      }
    },
    onClose,
  });
};
