import { MessageType } from "../Message";

type AddAction = {
  title: string;
  type: MessageType;
};

export type NotificationAction = AddAction;
