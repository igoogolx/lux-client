import { ConfirmModal, notifier } from "@/components/Core";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { getExecutablePath } from "lux-js-sdk";
import CodeBlock from "@/components/Core/CodeBlock";

export function ElevateModal(): JSX.Element {
  const { t } = useTranslation();
  const isAdmin = useSelector<RootState, boolean>(
    (state) => state.general.isAdmin
  );
  const [isLoading, setIsLoading] = useState(false);
  const [corePath, setCorePath] = useState("");

  useEffect(() => {
    getExecutablePath().then(path => {
      setCorePath(path);
    });
  }, []);

  return !isAdmin ? (
    <ConfirmModal
      title={t(TRANSLATION_KEY.ELEVATE_CORE)}
      content={
      <div>
        <div>
          {t(TRANSLATION_KEY.ELEVATE_TIP)}
        </div>
        <CodeBlock text={`sudo chown root ${corePath}`} />
        <CodeBlock text={`sudo chmod 770 ${corePath}`} />
        <CodeBlock text={`sudo chmod +sx ${corePath}`} />
      </div>
      }
      closeWhenClickOutside={false}
      loading={isLoading}
    />
  ) : (
    <></>
  );
}
