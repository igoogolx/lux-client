import { getToken } from "@/utils/auth";
import { SubscribeDnsStatistic } from "./types";
import { urtConfig } from "./url";
import { createWebsocket } from "./websocket";

export const subscribeDnsStatistic: SubscribeDnsStatistic = (config) => {
  const { onError, onClose, onMessage } = config;
  const url = `${urtConfig.dns}/statistic?token=${getToken()}`;
  return createWebsocket(url, {
    onError,
    onMessage: (data) => {
      if (typeof data === "string") {
        const statistic = JSON.parse(data);
        onMessage(statistic);
      }
    },
    onClose,
  });
};
