import { notifier } from "@/components/Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

export function useClipboard() {
  const { t } = useTranslation();
  const copy = useCallback(
    async (value: string) => {
      await navigator.clipboard.writeText(value);
      notifier.success(`${value}   ${t(TRANSLATION_KEY.COPIED)}`);
    },
    [t],
  );
  return { copy };
}
