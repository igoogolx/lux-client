export const ENCRYPTION_METHODS = [
  "aes-128-gcm",
  "aes-192-gcm",
  "aes-256-gcm",
  "rc4-md5",
  "aes-128-cfb",
  "aes-192-cfb",
  "aes-256-cfb",
  "aes-128-ctr",
  "aes-192-ctr",
  "aes-256-ctr",
  "bf-cfb",
  "camellia-128-cfb",
  "camellia-192-cfbw",
  "camellia-256-cfb",
  "chacha20-ietf-poly1305",
  "xchacha20-ietf-poly1305",
  "salsa20",
  "chacha20",
  "chacha20-ietf",
];

export enum SHADOWSOCKS_PLUGIN {
  OBFS = "obfs",
  V2RAY = "v2ray-plugin",
}

export const SHADOWSOCKS_PLUINS = [
  SHADOWSOCKS_PLUGIN.OBFS,
  SHADOWSOCKS_PLUGIN.V2RAY,
];

export enum SHADOWSOCKS_PLUGIN_MODE {
  HTTP = "http",
  TLS = "tls",
  WEBSOCKET = "websocket",
}

export const NONE_ID = "None";

export enum PageStepEnum {
  First,
  Second,
}
