import { type SubscribePing } from './types'
import { urtConfig } from './url'
import { createWebsocket } from './websocket'

export const subscribePing: SubscribePing = (config) => {
  const { onError, onClose, onMessage } = config
  const url = urtConfig.ping
  return createWebsocket(url, {
    onError,
    onMessage: (data) => {
      if (typeof data === 'string') {
        onMessage(data)
      }
    },
    onClose
  })
}
