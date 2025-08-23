import { TRANSLATION_KEY } from "@/i18n/locales/key";
import webviewContext from "@/utils/webviewContext";
import React, { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmModal, type ConfirmModalPros } from "../../Core";

type RestartAlertModalProps = Pick<ConfirmModalPros, "onCancel">;

export function RestartAlertModal(
  props: Readonly<RestartAlertModalProps>,
): ReactNode {
  const { onCancel } = props;
  const { t } = useTranslation();

  const handleConfirm = () => {
    if (webviewContext.isInWebview) {
      webviewContext.exitApp();
    }
    onCancel?.();
  };

  return (
    <ConfirmModal
      onConfirm={handleConfirm}
      title={t(TRANSLATION_KEY.RESTART_APP)}
      confirmText={t(
        webviewContext.isInWebview
          ? TRANSLATION_KEY.EXIT_APP
          : TRANSLATION_KEY.OK,
      )}
      hideCancelText
      content={
        <div>
          <div>{t(TRANSLATION_KEY.RESTART_APP_ALERT)}</div>
        </div>
      }
    />
  );
}
