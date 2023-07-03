import { Init } from "./types";
import { urtConfig } from "./url";

export const init: Init = (baseUrl) => {
  urtConfig.base = baseUrl;
};
