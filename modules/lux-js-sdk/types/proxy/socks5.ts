import { BaseProxy } from "./base";

export interface Socks5 extends BaseProxy {
  username?: string;
  password?: string;
  tls?: boolean;
  udp?: boolean;
  "skip-cert-verify"?: boolean;
}
