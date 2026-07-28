import { getToken } from "@/utils/auth";
import axios from "axios";
import type { Init } from "./types";
import { urtConfig } from "./url";

axios.interceptors.request.use(function (config) {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

export const init: Init = (baseUrl) => {
  urtConfig.base = baseUrl;
};
