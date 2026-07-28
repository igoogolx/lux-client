import { type IProxySocks5Config } from "proxy-uri-parser";
import { type CommonProxy } from "./base";

export interface Socks5 extends IProxySocks5Config, CommonProxy {}
