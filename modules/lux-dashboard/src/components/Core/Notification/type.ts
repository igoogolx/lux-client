import { MessageType } from "../Message";

export type TNotification = {
  id: number;
  title: string;
  type: MessageType;
  isShow: boolean;
};
