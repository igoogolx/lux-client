import { notificationEventManager } from './NotificationContainer'
import { MessageTypeEnum } from '../Message'
import { type NotificationAddActionItem } from '@/components/Core/Notification/reducer'

const createNotifier = () => {
  const create = (title: string, type: MessageTypeEnum, actions?: NotificationAddActionItem[]) => {
    notificationEventManager.emit({ title, type, actions })
  }

  const success = (title: string, actions?: NotificationAddActionItem[]) => { create(title, MessageTypeEnum.Success, actions) }
  const error = (title: string, actions?: NotificationAddActionItem[]) => { create(title, MessageTypeEnum.Error, actions) }
  const warn = (title: string, actions?: NotificationAddActionItem[]) => { create(title, MessageTypeEnum.Warning, actions) }
  const info = (title: string, actions?: NotificationAddActionItem[]) => { create(title, MessageTypeEnum.Info, actions) }

  return {
    success,
    error,
    warn,
    info
  }
}

export const notifier = createNotifier()

export { NotificationContainer } from './NotificationContainer'
