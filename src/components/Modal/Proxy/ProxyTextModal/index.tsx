import { notifier } from "@/components/Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { proxiesSlice } from "@/reducers";
import { formatError } from "@/utils/error";
import { decode } from "@/utils/url";
import { Button, Spinner, Textarea } from "@fluentui/react-components";
import axios from "axios";
import { addProxy } from "lux-js-sdk";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styles from "./index.module.css";

interface ProxyTextModalProps {
  close: () => void;
}

function ProxyTextModal(props: Readonly<ProxyTextModalProps>) {
  const { close } = props;
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleConfirm = async () => {
    setLoading(true);
    try {
      const proxyConfigs = decode(text);
      await Promise.all(
        proxyConfigs.map(async (proxyConfig) => {
          const proxy = { ...proxyConfig };
          const res = await addProxy({ proxy });
          dispatch(
            proxiesSlice.actions.addOne({
              proxy: { ...proxy, id: res.id },
            }),
          );
        }),
      );
      close();
    } catch (e) {
      if (!axios.isAxiosError(e)) {
        notifier.error(formatError(e));
      }
    } finally {
      setLoading(false);
    }
  };

  const isValid = text.trim().length !== 0;

  return (
    <div className={styles.container}>
      <div>{t(t(TRANSLATION_KEY.PROXY_TEXT))}</div>
      <Textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value.trim());
        }}
        className={styles.input}
        autoFocus
      />
      <div className={styles.buttonContainer}>
        <Button onClick={close} className={styles.button}>
          {t(TRANSLATION_KEY.FORM_CANCEL)}
        </Button>
        <Button
          className={styles.button}
          disabled={!isValid || loading}
          onClick={handleConfirm}
          appearance="primary"
        >
          {loading && <Spinner size="extra-tiny" className={styles.spinner} />}
          {t(TRANSLATION_KEY.FORM_SAVE)}
        </Button>
      </div>
    </div>
  );
}

export default ProxyTextModal;
