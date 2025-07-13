import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { proxiesSlice } from "@/reducers";
import { formatError } from "@/utils/error";
import { decode } from "@/utils/url";
import { Textarea } from "@fluentui/react-components";
import axios from "axios";
import { addProxy } from "lux-js-sdk";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Modal, notifier } from "../../Core";
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
  return (
    <Modal
      close={close}
      onOk={handleConfirm}
      title={t(TRANSLATION_KEY.NEW_IMPORT_PROXY_TEXT)}
      okText={t(TRANSLATION_KEY.FORM_SAVE)}
      loadingOk={loading}
    >
      <div className={styles.search}>
        <Textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value.trim());
          }}
          className={styles.input}
          placeholder={t(TRANSLATION_KEY.PROXY_TEXT)}
          autoFocus
        />
      </div>
    </Modal>
  );
}

export default ProxyTextModal;
