import { TRANSLATION_KEY } from "@/i18n/locales/key";
import QRCode from "qrcode";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Modal, notifier } from "../../Core";
import styles from "./index.module.css";

interface QrCodeModalProps {
  url: string;
  close: () => void;
}

const ELEMENT_ID = "qr-code";
export function QrCodeModal(
  props: Readonly<QrCodeModalProps>,
): React.ReactNode {
  const { url, close } = props;
  const { t } = useTranslation();
  useEffect(() => {
    QRCode.toCanvas(document.getElementById(ELEMENT_ID), url).catch((e) => {
      notifier.error(e.message || t(TRANSLATION_KEY.UNKNOWN_ERROR));
    });
  }, [t, url]);
  return (
    <Modal
      close={close}
      title={t(TRANSLATION_KEY.COMMON_QR_CODE)}
      hideCloseButton={true}
    >
      <div className={styles.container}>
        <canvas id={ELEMENT_ID} />
      </div>
    </Modal>
  );
}
