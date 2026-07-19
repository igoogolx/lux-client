import type { IProxyAnyTLSConfig } from "proxy-uri-parser";
import type { CommonProxy } from "./base";

export interface Anytls extends IProxyAnyTLSConfig, CommonProxy {}
