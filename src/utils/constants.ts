import { TRANSLATION_KEY } from "@/i18n/locales/key";

export const REPOSITORY_URL = "https://github.com/igoogolx/lux";

export const DOCS_URL = "https://igoogolx.github.io/lux-docs/docs/intro";

export const REPOSITORY_ISSUE_URL = "https://github.com/igoogolx/lux/issues";

export const LATEST_RELEASE_URL = `${REPOSITORY_URL}/releases/latest`;

export const APP_CONTAINER_ID = "app-content";

export enum ROUTER_PATH {
  Home = "/",
  Dashboard = "/dashboard",
  Connections = "/connections",
  Logger = "/logs",
  Setting = "/setting",
  About = "/about",
}

export const ROUTER_NAME = {
  [ROUTER_PATH.Home]: TRANSLATION_KEY.NAV_HOME,
  [ROUTER_PATH.Dashboard]: TRANSLATION_KEY.NAV_DATA,
  [ROUTER_PATH.Connections]: TRANSLATION_KEY.NAV_CONNECTION,
  [ROUTER_PATH.Logger]: TRANSLATION_KEY.LOG,
  [ROUTER_PATH.Setting]: TRANSLATION_KEY.NAV_SETTING,
  [ROUTER_PATH.About]: TRANSLATION_KEY.NAV_ABOUT,
};
