import { EventContext } from "@/components/Core/Event";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import React, { type ReactNode, useContext } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmModal, type ConfirmModalPros } from "../../Core";

type RestartAlertModalProps = Pick<ConfirmModalPros, "onCancel">;

export function RestartAlertModal(
  props: Readonly<RestartAlertModalProps>,
): ReactNode {
  const { onCancel } = props;
  const { t } = useTranslation();

  const eventHub = useContext(EventContext);

  const handleConfirm = () => {
    eventHub?.exitApp();
    onCancel?.();
  };

  return (
    <ConfirmModal
      onConfirm={handleConfirm}
      title={t(TRANSLATION_KEY.RESTART_APP)}
      confirmText={t(TRANSLATION_KEY.EXIT_APP)}
      hideCancelText
      content={
        <div>
          <div>{t(TRANSLATION_KEY.RESTART_APP_ALERT)}</div>
        </div>
      }
    />
  );
}
