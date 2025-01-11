import { getToken } from "@/utils/auth";
import { type SubscribeTraffic } from "./types";
import { urtConfig } from "./url";
import { createWebsocket } from "./websocket";

export const subscribeTraffic: SubscribeTraffic = (config) => {
  const { onError, onClose, onMessage } = config;
  const url = `${urtConfig.traffic}?token=${getToken()}`;
  return createWebsocket(url, {
    onError,
    onMessage: (data) => {
      if (typeof data === "string") {
        const traffic = JSON.parse(data);
        onMessage(traffic);
      }
    },
    onClose,
  });
};
