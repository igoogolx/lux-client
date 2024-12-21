import React, { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { ConfirmModal, type ConfirmModalPros } from "../../Core";

type ResetConfigModalProps = Pick<ConfirmModalPros, "onConfirm" | "onCancel">;

export function ResetConfigModal(props: ResetConfigModalProps): ReactNode {
  const { onCancel, onConfirm } = props;
  const { t } = useTranslation();

  return (
    <ConfirmModal
      onCancel={onCancel}
      onConfirm={onConfirm}
      title={t(TRANSLATION_KEY.RESET_CONFIG)}
      content={
        <div>
          <div>{t(TRANSLATION_KEY.RESET_CONFIG_TIPS)}</div>
        </div>
      }
    />
  );
}
