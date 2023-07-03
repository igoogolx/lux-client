import { ConfirmModal } from "@/components/Core";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { useSelector } from "react-redux";
import { proxiesSelectors, RootState } from "@/reducers";
import { Proxy } from "lux-js-sdk";

export function ServerConfirmModal(): JSX.Element {
  const { t } = useTranslation();
  const [isInvalid, setIsInvalid] = useState(false);
  const selectedProxyId = useSelector<RootState, string>(
    (state) => state.selected.proxy as string
  );
  const selectedProxy = useSelector<RootState, Proxy | undefined>((state) =>
    proxiesSelectors.selectById(state, selectedProxyId)
  );
  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared
  );
  const prevIsStarted = useRef(isStarted);
  const prevSelectedProxyId = useRef(selectedProxyId);

  useEffect(() => {
    if (
      (prevIsStarted.current !== isStarted ||
        prevSelectedProxyId.current !== selectedProxyId) &&
      isStarted
    ) {
      if (
        selectedProxy &&
        (selectedProxy.server.includes("127.0.0.1") ||
          selectedProxy.server.includes("localhost"))
      ) {
        setIsInvalid(true);
      }
    }

    prevIsStarted.current = isStarted;
    prevSelectedProxyId.current = selectedProxyId;
  }, [isStarted, selectedProxy, selectedProxy?.server, selectedProxyId]);

  return isInvalid ? (
    <ConfirmModal
      title={t(TRANSLATION_KEY.CHECK_SERVER_NAME)}
      content={t(TRANSLATION_KEY.CHECK_SERVER_NAME_TIP)}
      hideCancelText
      onConfirm={() => {
        setIsInvalid(false);
      }}
      closeWhenClickOutside={false}
    />
  ) : (
    <></>
  );
}
