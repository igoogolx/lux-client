import { type MessageType } from '../Message'

interface AddAction {
  title: string
  type: MessageType
}

export type NotificationAction = AddAction
