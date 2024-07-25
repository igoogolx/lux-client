import { type IProxyConfig } from 'proxy-uri-parser/src'

export enum ProxyTypeEnum {
  Shadowsocks = 'ss',
  Socks5 = 'socks5',
  Http = 'http',
}

export interface CommonProxy {
  id: string
  name: string
  delay?: number
  clashYamlUrl?: string
}

export interface BaseProxy extends IProxyConfig, CommonProxy {

}
