import type WsClient from 'isomorphic-ws'

interface BaseParams {
  onError?: (e: unknown) => void
  onMessage: (message: string) => void
  onClose?: () => void
}

export type SubscribePing = (params: BaseParams) => WsClient
