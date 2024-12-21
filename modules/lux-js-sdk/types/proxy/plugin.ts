import { type IProxyShadowsocksConfig } from "proxy-uri-parser/src/index";

export enum ObfsModeEnum {
  Tls = "tls",
  Http = "http",
}

export enum PluginTypeEnum {
  Obfs = "obfs",
  V2ray = "v2ray-plugin",
}

export type Obfs = IProxyShadowsocksConfig["plugin-opts"];

export type V2rayObfs = IProxyShadowsocksConfig["plugin-opts"];
