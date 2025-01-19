import { TRANSLATION_KEY } from "@/i18n/locales/key";
import React, { type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "../../Core";
import CodeBlock from "../../Core/CodeBlock";

interface ConfigFileDirModalProps {
  value: string;
  onCancel: () => void;
}

export function ConfigFileDirModal(
  props: Readonly<ConfigFileDirModalProps>,
): ReactNode {
  const { value, onCancel } = props;
  const { t } = useTranslation();

  return (
    <ConfirmModal
      hideCancelText
      title={t(TRANSLATION_KEY.CONFIG_FILE_DIR_MODAL_TITLE)}
      content={<div>{<CodeBlock text={value} />}</div>}
      onCancel={onCancel}
    />
  );
}
