import { TNotification } from "./type";
import { MessageType } from "../Message";

export enum NotificationActionTypeEnum {
  Add,
  Remove,
  Close,
}

type AddAction = {
  type: NotificationActionTypeEnum.Add;
  payload: { title: string; type: MessageType };
};

type RemoveAction = {
  type: NotificationActionTypeEnum.Remove;
  payload: { id: number };
};

type CloseAction = {
  type: NotificationActionTypeEnum.Close;
  payload: { id: number };
};

export type NotificationAction = AddAction | RemoveAction | CloseAction;

export function reducer(
  state: { notifications: TNotification[]; counter: number },
  action: NotificationAction
) {
  switch (action.type) {
    case NotificationActionTypeEnum.Add: {
      const { title, type } = action.payload;
      const notification = {
        title,
        type,
        id: state.counter,
        isShow: true,
      };
      return {
        ...state,
        notifications: [...state.notifications, notification],
        counter: state.counter + 1,
      };
    }
    case NotificationActionTypeEnum.Remove: {
      const { id } = action.payload;
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== id
        ),
      };
    }
    case NotificationActionTypeEnum.Close: {
      const { id } = action.payload;
      const findIndex = (notifications: TNotification[], target: number) =>
        notifications.findIndex((t) => t.id === target);
      const index = findIndex(state.notifications, id);
      const newNotification = {
        ...state.notifications[index],
        isShow: false,
      };
      return {
        ...state,
        notifications: [
          ...state.notifications.slice(0, index),
          newNotification,
          ...state.notifications.slice(index + 1, state.notifications.length),
        ],
      };
    }
    default:
      throw new Error();
  }
}
