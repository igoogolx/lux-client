import type WsClient from 'isomorphic-ws'
import { type RULE_TYPE } from '../rule'

export enum ConnNetworkMetaEnum {
  Tcp = 'tcp',
  Udp = 'udp',
}

export interface Metadata {
  network: ConnNetworkMetaEnum
  type: number
  sourceIp: string
  destinationIP: string
  sourcePort: number
  destinationPort: number
  processPath: string
}

export enum ConnRuleEnum {
  Direct = 'DIRECT',
  Proxy = 'PROXY',
  Reject = 'REJECT',
}

export interface Conn {
  id: string
  metadata: Metadata
  upload: number
  download: number
  start: number
  rule: { ruleType: RULE_TYPE, payload: string, policy: ConnRuleEnum }
  domain: string
}

export interface ConnectionsParams {
  onError?: (e: unknown) => void
  onMessage: (message: Conn[]) => void
  onClose?: () => void
}

export type SubscribeConnections = (params: ConnectionsParams) => WsClient

export type CloseConnection = (info: { id: string }) => Promise<void>

export type CloseAllConnections = () => Promise<void>
