import { TRANSLATION_KEY } from "@/i18n/locales/key";
import webviewContext from "@/utils/webviewContext";
import { Link, Subtitle2 } from "@fluentui/react-components";
import {
  getRuntimeDetail,
  type RuntimeDetail,
  RuntimeDnsDetail,
} from "lux-js-sdk";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, notifier } from "../../Core";
import styles from "./index.module.css";

interface DiagnosticsModalProps {
  close: () => void;
}

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

export function DiagnosticsModal(
  props: DiagnosticsModalProps,
): React.ReactNode {
  const { close } = props;
  const { t } = useTranslation();
  const [runtimeDetail, setRuntimeDetail] =
    useState<Partial<RuntimeDetail> | null>(null);

  useEffect(() => {
    getRuntimeDetail().then((detail) => {
      setRuntimeDetail({
        ...(detail || {}),
      });
    });
  }, []);

  function renderDefaultItem(
    key: keyof Partial<RuntimeDetail>,
    content: string,
  ) {
    const handleOpenHub = () => {
      if (webviewContext.isInWebview) {
        webviewContext.openWebDashboard();
      } else {
        window.open(content);
      }
    };
    return (
      <div className={styles.item}>
        <Subtitle2>{`${t(TRANSLATION_KEY_MAP[key])}:`}</Subtitle2>
        <div className={styles.content}>
          {key === "hubAddress" ? (
            <Link onClick={handleOpenHub}>{content}</Link>
          ) : (
            content
          )}
        </div>
      </div>
    );
  }

  function renderDnsItem(
    key: keyof Partial<RuntimeDetail>,
    detail: RuntimeDnsDetail,
  ) {
    return (
      <div className={styles.item}>
        <Subtitle2>{`${t(TRANSLATION_KEY_MAP[key])}:`}</Subtitle2>
        <div className={styles.content}>{detail.addresses.join(",")}</div>
        <div className={styles.content}>{detail.servers.join(",")}</div>
      </div>
    );
  }

  function renderContent(detail: Partial<RuntimeDetail>) {
    return (Object.keys(detail) as Array<keyof Partial<RuntimeDetail>>)
      .map((key) => {
        const value = detail[key];
        if (!value) return null;
        if (typeof value === "string") {
          return <div key={key}>{renderDefaultItem(key, value)}</div>;
        }
        return <div key={key}>{renderDnsItem(key, value)}</div>;
      })
      .filter(Boolean);
  }

  return runtimeDetail ? (
    <Modal
      hideCloseButton={true}
      close={close}
      onOk={async () => {
        await navigator.clipboard.writeText(
          JSON.stringify(runtimeDetail, undefined, 2),
        );
        notifier.success(t(TRANSLATION_KEY.COPIED));
      }}
      okText={t(TRANSLATION_KEY.COPY)}
      title={t(TRANSLATION_KEY.DIAGNOSTICS)}
    >
      {renderContent(runtimeDetail)}
    </Modal>
  ) : (
    ""
  );
}
