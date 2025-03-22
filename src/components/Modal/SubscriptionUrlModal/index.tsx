import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { proxiesSlice } from "@/reducers";
import { formatError } from "@/utils/error";
import { decodeFromUrl } from "@/utils/url";
import { Textarea } from "@fluentui/react-components";
import axios from "axios";
import { addProxiesFromSubscriptionUrl } from "lux-js-sdk";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Modal, notifier } from "../../Core";
import styles from "./index.module.css";

interface SubscriptionUrlModalProps {
  close: () => void;
}

function SubscriptionUrlModal(props: Readonly<SubscriptionUrlModalProps>) {
  const { close } = props;
  const { t } = useTranslation();
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleConfirm = async () => {
    try {
      setLoading(true);
      if (destination) {
        try {
          const decodedProxies = await decodeFromUrl(destination);
          const res = await addProxiesFromSubscriptionUrl({
            proxies: decodedProxies,
            subscriptionUrl: destination,
          });
          dispatch(proxiesSlice.actions.received({ proxies: res.proxies }));
          close();
          notifier.success(t(TRANSLATION_KEY.UPDATE_SUCCESS));
        } catch (e) {
          if (!axios.isAxiosError(e)) {
            notifier.error(formatError(e));
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      close={close}
      onOk={handleConfirm}
      loadingOk={loading}
      title={t(TRANSLATION_KEY.NEW_IMPORT_SUBSCRIPTION_URL)}
      okText={t(TRANSLATION_KEY.FORM_SAVE)}
    >
      <div className={styles.search}>
        <Textarea
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value.trim());
          }}
          className={styles.input}
          placeholder={t(TRANSLATION_KEY.SUBSCRIPTION_URL)}
          autoFocus
        />
      </div>
    </Modal>
  );
}

export default SubscriptionUrlModal;
