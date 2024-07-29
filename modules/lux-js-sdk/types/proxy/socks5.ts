import { type CommonProxy } from './base'
import { type IProxySocks5Config } from 'proxy-uri-parser/src'

export interface Socks5 extends IProxySocks5Config, CommonProxy {
}
