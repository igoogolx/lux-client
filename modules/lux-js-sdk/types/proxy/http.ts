import type { IProxyHttpConfig } from 'proxy-uri-parser/src'
import { type CommonProxy } from './base'

export interface Http extends IProxyHttpConfig, CommonProxy {
}
