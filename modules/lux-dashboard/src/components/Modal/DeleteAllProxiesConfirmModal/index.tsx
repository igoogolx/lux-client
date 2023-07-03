import { ConfirmModal } from "@/components/Core";
import React from "react";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";

type DeleteAllProxiesConfirmModalProps = {
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

export function DeleteAllProxiesConfirmModal(
  props: DeleteAllProxiesConfirmModalProps
): JSX.Element {
  const { onConfirm, onClose } = props;
  const { t } = useTranslation();

  return (
    <ConfirmModal
      title={t(TRANSLATION_KEY.WARNING)}
      content={t(TRANSLATION_KEY.DELETE_ALL_PROXIES_TIPS)}
      hideCancelText
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  );
}
