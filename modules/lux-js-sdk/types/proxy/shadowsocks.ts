import { BaseProxy } from "./base";
import { Obfs, PluginTypeEnum, V2rayObfs } from "./plugin";

export interface Shadowsocks extends BaseProxy {
  password: string;
  cipher: string;
  udp?: boolean;
  plugin?: PluginTypeEnum;
  "plugin-opts"?: Obfs | V2rayObfs;
}
