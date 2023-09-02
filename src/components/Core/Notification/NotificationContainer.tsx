import React, { useCallback, useEffect, useReducer, useRef } from "react";
import { Transition } from "react-transition-group";
import { Portal } from "@fluentui/react-components";
import { APP_CONTAINER_ID } from "../../../utils/constants";
import {
  NotificationAction,
  NotificationActionTypeEnum,
  reducer,
} from "./reducer";
import { createEventManager } from "./util";
import { Message, MessageType } from "../Message";
import styles from "./index.module.css";

export const notificationEventManager =
  createEventManager<NotificationAction>();

const TRANSITION_TIMEOUT_MS = 200;
const DURATION_MS = 2000;

const CONTAINER_ID = "notification-container";

function MessageWithDuration(props: {
  duration: number;
  title: string;
  close: (id: number) => void;
  type: MessageType;
  id: number;
}) {
  const { title, close, type, duration, id } = props;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleClose = useCallback(() => {
    close(id);
  }, [close, id]);
  const startCloseTimer = useCallback(() => {
    if (duration) {
      closeTimer.current = setTimeout(() => {
        handleClose();
      }, duration);
    }
  }, [duration, handleClose]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  useEffect(() => {
    startCloseTimer();
    return clearCloseTimer;
  }, [clearCloseTimer, startCloseTimer]);

  return (
    <Message
      title={title}
      type={type}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={startCloseTimer}
      close={handleClose}
    />
  );
}

export function NotificationContainer() {
  const [notificationState, dispatch] = useReducer(reducer, {
    notifications: [],
    counter: 0,
  });

  let container = document.getElementById(CONTAINER_ID);
  if (!container) {
    container = document.createElement("div");
    container.setAttribute("id", CONTAINER_ID);
    container.setAttribute("class", styles.container);
    const root = document.getElementById(APP_CONTAINER_ID);
    root?.prepend(container);
  }

  const remove = useCallback((id: number) => {
    dispatch({ type: NotificationActionTypeEnum.Remove, payload: { id } });
  }, []);

  const close = useCallback((id: number) => {
    dispatch({ type: NotificationActionTypeEnum.Close, payload: { id } });
  }, []);

  useEffect(() => {
    notificationEventManager.on((data) => {
      dispatch(data);
    });
    return () => {
      notificationEventManager.remove();
    };
  }, []);

  return (
    <Portal mountNode={container}>
      {notificationState.notifications.map((notification) => (
        <Transition
          appear
          unmountOnExit
          timeout={TRANSITION_TIMEOUT_MS}
          onExited={() => remove(notification.id)}
          in={notification.isShow}
          key={notification.id}
        >
          {(state) => (
            <div data-state={state} className={styles.animation}>
              <MessageWithDuration
                title={notification.title}
                duration={DURATION_MS}
                close={close}
                id={notification.id}
                type={notification.type}
              />
            </div>
          )}
        </Transition>
      ))}
    </Portal>
  );
}
