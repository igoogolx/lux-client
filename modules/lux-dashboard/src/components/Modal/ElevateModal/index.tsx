import { ConfirmModal, notifier } from "@/components/Core";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers";
import React, { useState } from "react";
import { elevate, exit } from "@/clientContext";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";

export function ElevateModal(): JSX.Element {
  const { t } = useTranslation();
  const isAdmin = useSelector<RootState, boolean>(
    (state) => state.general.isAdmin
  );
  const [isLoading, setIsLoading] = useState(false);
  const onConfirm = async () => {
    try {
      setIsLoading(true);
      await elevate();
    } catch (e) {
      notifier.error((e as { message?: string }).message || "");
    } finally {
      setIsLoading(false);
    }
  };
  return !isAdmin ? (
    <ConfirmModal
      title={t(TRANSLATION_KEY.ELEVATE_CORE)}
      content={t(TRANSLATION_KEY.ELEVATE_TIP)}
      cancelText={t(TRANSLATION_KEY.EXIT)}
      onCancel={exit}
      onConfirm={onConfirm}
      closeWhenClickOutside={false}
      loading={isLoading}
    />
  ) : (
    <></>
  );
}
