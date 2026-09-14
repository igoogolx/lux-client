import { getToken } from "@/utils/auth";
import axios from "axios";
import type { SubscribeDnsStatistic, ValidateDnsServer } from "./types";
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

export const validateDnsServer: ValidateDnsServer = (params) => {
  const url = `${urtConfig.dns}/validate`;
  return axios.post(url, params);
};
