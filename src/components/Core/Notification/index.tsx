import { notificationEventManager } from './NotificationContainer'
import { MessageTypeEnum } from '../Message'

const createNotifier = () => {
  const create = (title: string, type: MessageTypeEnum) => {
    notificationEventManager.emit({ title, type })
  }

  const success = (title: string) => { create(title, MessageTypeEnum.Success) }
  const error = (title: string) => { create(title, MessageTypeEnum.Error) }
  const warn = (title: string) => { create(title, MessageTypeEnum.Warning) }
  const info = (title: string) => { create(title, MessageTypeEnum.Info) }

  return {
    success,
    error,
    warn,
    info
  }
}

export const notifier = createNotifier()

export { NotificationContainer } from './NotificationContainer'
