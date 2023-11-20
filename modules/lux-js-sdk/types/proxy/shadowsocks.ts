import { type BaseProxy } from './base'
import { type Obfs, type PluginTypeEnum, type V2rayObfs } from './plugin'

export interface Shadowsocks extends BaseProxy {
  password: string
  cipher: string
  udp?: boolean
  plugin?: PluginTypeEnum
  'plugin-opts'?: Obfs | V2rayObfs
}
