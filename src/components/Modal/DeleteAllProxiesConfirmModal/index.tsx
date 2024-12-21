import React from "react";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { ConfirmModal } from "../../Core";

interface DeleteAllProxiesConfirmModalProps {
  onConfirm: () => Promise<void>;
  onClose: () => void;
  title: string;
}

export function DeleteAllProxiesConfirmModal(
  props: DeleteAllProxiesConfirmModalProps,
): React.ReactNode {
  const { onConfirm, onClose, title } = props;
  const { t } = useTranslation();

  return (
    <ConfirmModal
      title={t(TRANSLATION_KEY.DELETE_PROXIES)}
      content={t(TRANSLATION_KEY.DELETE_ALL_PROXIES_TIPS, { title })}
      onConfirm={onConfirm}
      onCancel={onClose}
    />
  );
}
