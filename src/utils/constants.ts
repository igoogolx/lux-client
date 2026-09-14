import { TRANSLATION_KEY } from "@/i18n/locales/key";

export const REPOSITORY_URL = "https://github.com/igoogolx/lux";

export const DOCS_URL = "https://igoogolx.github.io/lux-docs/docs/intro";

export const REPOSITORY_ISSUE_URL = "https://github.com/igoogolx/lux/issues";

export const CLASH_YAML_CONFIG_DOCS_URL =
  "https://wiki.metacubex.one/en/config/proxies/";

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
  Yaml = "Yaml",
}

export enum ROUTE_PARAM_MODE {
  EDIT = "edit",
  QR_CODE = "qrCode",
  ADD = "add",
}
export const LOCAL_SERVERS = "local_servers";
export enum DNS_SERVER_TYPE {
  UDP = "udp",
  TCP = "tcp",
  TLS = "tls",
  HTTPS = "https",
  QUIC = "quic",
  DHCP = "dhcp",
  RCODE = "rcode",
}

export const DNS_PAYLOAD_PLACEHOLDER = {
  [DNS_SERVER_TYPE.UDP]: "8.8.8.8:53",
  [DNS_SERVER_TYPE.TCP]: "8.8.8.8:53",
  [DNS_SERVER_TYPE.TLS]: "1.1.1.1",

  [DNS_SERVER_TYPE.HTTPS]: "doh.pub/dns-query",
  [DNS_SERVER_TYPE.QUIC]: "dns.adguard.com:784",
  [DNS_SERVER_TYPE.DHCP]: "en0",
  [DNS_SERVER_TYPE.RCODE]: "success or server_failure",
};

export const DNS_TYPE_OPTIONS = [
  {
    id: DNS_SERVER_TYPE.UDP,
    content: "UDP",
  },
  {
    id: DNS_SERVER_TYPE.TCP,
    content: "TCP",
  },
  {
    id: DNS_SERVER_TYPE.HTTPS,
    content: "HTTPS",
  },
  {
    id: DNS_SERVER_TYPE.TLS,
    content: "TLS",
  },
  {
    id: DNS_SERVER_TYPE.DHCP,
    content: "DHCP",
  },
  {
    id: DNS_SERVER_TYPE.QUIC,
    content: "QUIC",
  },
  {
    id: DNS_SERVER_TYPE.RCODE,
    content: "RCODE",
  },
];

export const DNS_TYPE_TRANSLATION = Object.fromEntries(
  DNS_TYPE_OPTIONS.map((o) => [o.id, o.content]),
);
