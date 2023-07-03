import { BaseProxy } from "./base";

export interface Http extends BaseProxy {
  username?: string;
  password?: string;
  tls?: boolean;
  sni?: string;
  "skip-cert-verify"?: boolean;
}
