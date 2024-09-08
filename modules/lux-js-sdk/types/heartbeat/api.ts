import type WsClient from 'isomorphic-ws'

interface PingParams {
  onError?: (e: unknown) => void
  onMessage: (message: string) => void
  onClose?: () => void
}

export type SubscribePing = (params: PingParams) => WsClient

interface RuntimeStatus {
  addr: string
  name: string
  isStarted: boolean
}

interface RuntimeStatusParams {
  onError?: (e: unknown) => void
  onMessage: (message: RuntimeStatus) => void
  onClose?: () => void
}

export type SubscribeRuntimeStatus = (params: RuntimeStatusParams) => WsClient
