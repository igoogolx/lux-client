export enum ProxyTypeEnum {
  Shadowsocks = "ss",
  Socks5 = "socks5",
  Http = "http",
}
export interface BaseProxy {
  id: string;
  name: string;
  server: string;
  port: number;
  type: ProxyTypeEnum;
  delay?: number;
}
