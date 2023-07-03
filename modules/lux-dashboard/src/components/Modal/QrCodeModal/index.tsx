import React, { useEffect } from "react";
import { Modal, notifier } from "@/components/Core";
import QRCode from "qrcode";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import styles from "./index.module.css";

type QrCodeModalProps = {
  url: string;
  close: () => void;
};

const ELEMENT_ID = "qr-code";
export function QrCodeModal(props: QrCodeModalProps): JSX.Element {
  const { url, close } = props;
  const { t } = useTranslation();
  useEffect(() => {
    QRCode.toCanvas(document.getElementById(ELEMENT_ID), url).catch((e) => {
      notifier.error(e.message || t(TRANSLATION_KEY.UNKNOWN_ERROR));
    });
  }, [t, url]);
  return (
    <Modal close={close}>
      <div className={styles.container}>
        <canvas id={ELEMENT_ID} />
      </div>
    </Modal>
  );
}
