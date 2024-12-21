import { type MessageType } from "../Message";

export interface NotificationAddActionItem {
  text: string;
  onClick: () => void;
}

interface AddAction {
  title: string;
  type: MessageType;
  actions?: NotificationAddActionItem[];
}

export type NotificationAction = AddAction;
