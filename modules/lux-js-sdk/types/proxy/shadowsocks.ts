import { type IProxyShadowsocksConfig } from "proxy-uri-parser";
import { type CommonProxy } from "./base";

export interface Shadowsocks extends IProxyShadowsocksConfig, CommonProxy {}
