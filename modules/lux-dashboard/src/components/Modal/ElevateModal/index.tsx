import { ConfirmModal } from "@/components/Core";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { getExecutablePath } from "lux-js-sdk";
import CodeBlock from "@/components/Core/CodeBlock";

const CORE_PATH_VAR = 'LUX_CORE_PATH'

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
        <CodeBlock text={`export ${CORE_PATH_VAR}=${corePath}\nsudo chown root $${CORE_PATH_VAR}\nsudo chmod 770 $${CORE_PATH_VAR}\nsudo chmod +sx $${CORE_PATH_VAR}`} />
      </div>
      }
      closeWhenClickOutside={false}
      loading={isLoading}
    />
  ) : (
    <></>
  );
}
