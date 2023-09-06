import { useSelector } from "react-redux";
import React, { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getExecutablePath } from "lux-js-sdk";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { RootState } from "@/reducers";
import { ConfirmModal } from "../../Core";
import CodeBlock from "../../Core/CodeBlock";

const CORE_PATH_VAR = "LUX_CORE_PATH";

export function ElevateModal(): ReactNode {
  const { t } = useTranslation();
  const isAdmin = useSelector<RootState, boolean>(
    (state) => state.general.isAdmin
  );
  const [corePath, setCorePath] = useState("");

  useEffect(() => {
    getExecutablePath().then((path) => {
      setCorePath(path);
    });
  }, []);

  return !isAdmin ? (
    <ConfirmModal
      title={t(TRANSLATION_KEY.ELEVATE_CORE)}
      content={
        <div>
          <div>{t(TRANSLATION_KEY.ELEVATE_TIP)}</div>
          <CodeBlock
            text={`export ${CORE_PATH_VAR}=${corePath}\nsudo chown root $${CORE_PATH_VAR}\nsudo chmod 770 $${CORE_PATH_VAR}\nsudo chmod +sx $${CORE_PATH_VAR}`}
          />
        </div>
      }
      closeWhenClickOutside={false}
    />
  ) : (
    ""
  );
}
