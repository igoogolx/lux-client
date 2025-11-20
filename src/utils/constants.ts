import { TRANSLATION_KEY } from "@/i18n/locales/key";

export const REPOSITORY_URL = "https://github.com/igoogolx/lux";

export const DOCS_URL = "https://igoogolx.github.io/lux-docs/docs/intro";

export const REPOSITORY_ISSUE_URL = "https://github.com/igoogolx/lux/issues";

export const LATEST_RELEASE_URL = `${REPOSITORY_URL}/releases/latest`;

export const APP_CONTAINER_ID = "app-content";

export const LAST_CHECK_UPDATE_DATE = "LAST_CHECK_UPDATE_DATE";

export const CUSTOMIZED_RULE_ID = "customized";

export enum ROUTER_PATH {
  Home = "/",
  Dashboard = "/dashboard",
  Logger = "/logs",
  Setting = "/setting",
  About = "/about",
  Rules = "/rules",
}

export const ROUTER_NAME = {
  [ROUTER_PATH.Home]: TRANSLATION_KEY.NAV_HOME,
  [ROUTER_PATH.Rules]: TRANSLATION_KEY.RULE,
  [ROUTER_PATH.Dashboard]: TRANSLATION_KEY.NAV_DATA,
  [ROUTER_PATH.Logger]: TRANSLATION_KEY.LOG,
  [ROUTER_PATH.Setting]: TRANSLATION_KEY.NAV_SETTING,
  [ROUTER_PATH.About]: TRANSLATION_KEY.NAV_ABOUT,
};

export enum PROXY_MODE_ENUM {
  TUN = "tun",
  SYSTEM = "system",
  MIXED = "mixed",
}
export const MODE_TRANSLATION_KEY = {
  [PROXY_MODE_ENUM.TUN]: TRANSLATION_KEY.TUN,
  [PROXY_MODE_ENUM.SYSTEM]: TRANSLATION_KEY.SYSTEM,
  [PROXY_MODE_ENUM.MIXED]: TRANSLATION_KEY.MIXED_MODE,
};

export enum OtherProxyTypeEnum {
  Subscription = "Subscription",
  Text = "Text",
}

export enum ROUTE_PARAM_MODE {
  EDIT = "edit",
  QR_CODE = "qrCode",
  ADD = "add",
}
