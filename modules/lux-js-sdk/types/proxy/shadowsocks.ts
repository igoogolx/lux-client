import { type IProxyShadowsocksConfig } from 'proxy-uri-parser/src'
import { type CommonProxy } from './base'

export interface Shadowsocks extends IProxyShadowsocksConfig, CommonProxy {
}
