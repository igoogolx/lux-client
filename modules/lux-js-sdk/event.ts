import { getToken } from "@/utils/auth";
import { SubscribeEvent } from "./types/event";
import { urtConfig } from "./url";
import { createWebsocket } from "./websocket";

export enum EVENT_TYPE {
  UPDATE_SETTING = "update_setting",
}

export const subscribeEvent: SubscribeEvent = (config) => {
  const { onError, onClose, onMessage } = config;
  const url = `${urtConfig.event}?token=${getToken()}`;
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
