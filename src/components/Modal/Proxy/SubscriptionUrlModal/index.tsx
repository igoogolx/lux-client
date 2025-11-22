import { notifier } from "@/components/Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { proxiesSlice } from "@/reducers";
import { formatError } from "@/utils/error";
import { decodeFromUrl } from "@/utils/url";
import { Button, Spinner, Textarea } from "@fluentui/react-components";
import axios from "axios";
import { addProxiesFromSubscriptionUrl } from "lux-js-sdk";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
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
  const isValid = destination.trim().length !== 0;
  return (
    <div className={styles.container}>
      <div>{t(t(TRANSLATION_KEY.SUBSCRIPTION_URL))}</div>
      <Textarea
        value={destination}
        onChange={(e) => {
          setDestination(e.target.value.trim());
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

export default SubscriptionUrlModal;
