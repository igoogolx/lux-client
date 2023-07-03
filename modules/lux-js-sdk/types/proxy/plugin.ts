export enum ObfsModeEnum {
  Tls = "tls",
  Http = "http",
}

export enum PluginTypeEnum {
  Obfs = "obfs",
  V2ray = "v2ray-plugin",
}

export type Obfs = {
  mode: ObfsModeEnum;
  host: string;
};

export type V2rayObfs = {
  mode: "websocket";
  host: string;
  port: string;
  path: string;
  tls: boolean;
  skipCertVerify: boolean;
};
