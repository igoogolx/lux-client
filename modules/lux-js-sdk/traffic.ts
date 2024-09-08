import { type SubscribeNowTraffic, type SubscribeTotalTraffic } from './types'
import { urtConfig } from './url'
import { createWebsocket } from './websocket'

export const subscribeNowTraffic: SubscribeNowTraffic = (config) => {
  const { onError, onClose, onMessage } = config
  const url = `${urtConfig.traffic}/now`
  return createWebsocket(url, {
    onError,
    onMessage: (data) => {
      if (typeof data === 'string') {
        const traffic = JSON.parse(data)
        onMessage(traffic)
      }
    },
    onClose
  })
}

export const subscribeTotalTraffic: SubscribeTotalTraffic = (config) => {
  const { onError, onClose, onMessage } = config
  const url = `${urtConfig.traffic}/total`
  return createWebsocket(url, {
    onError,
    onMessage: (data) => {
      if (typeof data === 'string') {
        const traffic = JSON.parse(data)
        onMessage(traffic)
      }
    },
    onClose
  })
}
