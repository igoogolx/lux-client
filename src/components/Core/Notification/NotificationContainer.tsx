import { TRANSLATION_KEY } from "@/i18n/locales/key";
import {
  Link,
  Toast,
  Toaster,
  ToastFooter,
  ToastTitle,
  ToastTrigger,
  useId,
  useToastController,
} from "@fluentui/react-components";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { type NotificationAction } from "./reducer";
import { createEventManager } from "./util";

export const notificationEventManager =
  createEventManager<NotificationAction>();

export function NotificationContainer() {
  const toasterId = useId("toaster");
  const { dispatchToast } = useToastController(toasterId);
  const { t } = useTranslation();

  useEffect(() => {
    notificationEventManager.on((data) => {
      dispatchToast(
        <Toast>
          <ToastTitle
            action={
              <ToastTrigger>
                <Link>{t(TRANSLATION_KEY.DISMISS)}</Link>
              </ToastTrigger>
            }
          >
            {data.title}
          </ToastTitle>
          {data.actions && (
            <ToastFooter>
              {data.actions.map((action) => {
                return (
                  <Link key={action.text} onClick={action.onClick}>
                    {action.text}
                  </Link>
                );
              })}
            </ToastFooter>
          )}
        </Toast>,
        { intent: data.type, position: "top", pauseOnHover: true },
      );
    });
    return () => {
      notificationEventManager.remove();
    };
  }, [dispatchToast, t]);

  return <Toaster toasterId={toasterId} />;
}
