import React, { useEffect, useState } from "react";
import { Modal } from "@/components/Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { useTranslation } from "react-i18next";
import { getHubAddress, stringAddress } from "@/utils/hubAddress";
import { shellOpenExternal } from "@/clientContext";
import { getRuntimeDetail, RuntimeDetail } from "lux-js-sdk";
import { Button, Link, Subtitle2 } from "@fluentui/react-components";
import styles from "./index.module.css";

type RuntimeDetailModalProps = {
  close: () => void;
};

const TRANSLATION_KEY_MAP = {
  directedInterfaceName: TRANSLATION_KEY.COMMON_DEFAULT_INTERFACE_NAME,
  directedInterfaceV4Addr: TRANSLATION_KEY.DEFAULT_INTERFACE_V4_ADDR,
  tunInterfaceName: TRANSLATION_KEY.COMMON_TUN_INTERFACE_NAME,
  localDns: TRANSLATION_KEY.SETTING_PRIMARY_DNS,
  remoteDns: TRANSLATION_KEY.SETTING_SECONDARY_DNS,
  hubAddress: TRANSLATION_KEY.HUB_ADDRESS,
  boostDns: TRANSLATION_KEY.BOOST_DNS,
  proxyServer: TRANSLATION_KEY.PROXY_SERVER,
};

export function RuntimeDetailModal(
  props: RuntimeDetailModalProps
): JSX.Element {
  const { close } = props;
  const { t } = useTranslation();
  const [runtimeDetail, setRuntimeDetail] = useState<
    (RuntimeDetail & { hubAddress: string }) | null
  >(null);

  useEffect(() => {
    getRuntimeDetail().then((detail) => {
      const hubAddress = getHubAddress();
      setRuntimeDetail({ ...detail, hubAddress: stringAddress(hubAddress) });
    });
  }, []);

  return runtimeDetail ? (
    <Modal close={close}>
      {(Object.keys(runtimeDetail) as (keyof typeof runtimeDetail)[]).map(
        (key) => {
          const content = Array.isArray(runtimeDetail[key])
            ? (runtimeDetail[key] as string[]).join(",")
            : runtimeDetail[key];
          return (
            <div className={styles.item} key={key}>
              <Subtitle2>{`${t(TRANSLATION_KEY_MAP[key])}:`}</Subtitle2>
              <div className={styles.content}>
                {key === "hubAddress" ? (
                  <Button
                    onClick={() => {
                      shellOpenExternal(`http://${content}` as string);
                    }}
                    appearance="transparent"
                  >
                    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                    <Link as="button">{content}</Link>
                  </Button>
                ) : (
                  content
                )}
              </div>
            </div>
          );
        }
      )}
    </Modal>
  ) : (
    <></>
  );
}
