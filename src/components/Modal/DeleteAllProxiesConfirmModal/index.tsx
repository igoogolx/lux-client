import React from "react";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { ConfirmModal } from "../../Core";

type DeleteAllProxiesConfirmModalProps = {
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

export function DeleteAllProxiesConfirmModal(
  props: DeleteAllProxiesConfirmModalProps
): React.ReactNode {
  const { onConfirm, onClose } = props;
  const { t } = useTranslation();

  return (
    <ConfirmModal
      title={t(TRANSLATION_KEY.WARNING)}
      content={t(TRANSLATION_KEY.DELETE_ALL_PROXIES_TIPS)}
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  );
}
