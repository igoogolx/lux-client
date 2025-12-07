import { Field, Form, notifier } from "@/components/Core";
import { TextareaField } from "@/components/Core/Form/TextareaField";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { proxiesSlice, type RootState, subscriptionsSlice } from "@/reducers";
import { formatError } from "@/utils/error";
import { decodeFromUrl } from "@/utils/url";
import { Button, Spinner } from "@fluentui/react-components";
import axios from "axios";
import {
  addProxiesFromSubscriptionUrl,
  Subscription,
  updateSubscription,
  updateSubscriptionProxies,
} from "lux-js-sdk";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import styles from "./index.module.css";

interface SubscriptionModalProps {
  close: () => void;
  initialValue?: Subscription;
  isSelected?: boolean;
}

const INIT_DATA: Subscription = {
  id: "",
  name: "",
  url: "",
  remark: "",
};

function SubscriptionModal(props: Readonly<SubscriptionModalProps>) {
  const { close, initialValue, isSelected } = props;
  const { t } = useTranslation();

  const SubscriptionSchema = Yup.object().shape({
    url: Yup.string().required(t(TRANSLATION_KEY.REQUIRED)),
    name: Yup.string(),
    remark: Yup.string(),
  });

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared,
  );

  const onSubmit = async (data: Subscription) => {
    try {
      setLoading(true);
      if (!data.url) {
        return;
      }

      try {
        if (data.id) {
          await updateSubscription({ subscription: data });
          dispatch(
            subscriptionsSlice.actions.updateOne({ subscription: data }),
          );
          if (initialValue?.url !== data.url) {
            const decodedProxies = await decodeFromUrl(data.url);
            const res = await updateSubscriptionProxies({
              subscriptionId: data.id,
              proxies: decodedProxies,
            });
            dispatch(proxiesSlice.actions.received({ proxies: res.proxies }));
          }
        } else {
          const decodedProxies = await decodeFromUrl(data.url);
          const res = await addProxiesFromSubscriptionUrl({
            proxies: decodedProxies,
            subscriptionUrl: data.url,
            subscriptionName: data.name,
            subscriptionRemark: data.remark,
          });
          dispatch(proxiesSlice.actions.received({ proxies: res.proxies }));
          dispatch(
            subscriptionsSlice.actions.received({
              subscriptions: res.subscriptions,
            }),
          );
        }
        close();
        notifier.success(t(TRANSLATION_KEY.UPDATE_SUCCESS));
      } catch (e) {
        if (!axios.isAxiosError(e)) {
          notifier.error(formatError(e));
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValue ?? INIT_DATA}
      validationSchema={SubscriptionSchema}
    >
      {({ isValid, submitForm }) => {
        return (
          <>
            <TextareaField<keyof Subscription>
              name="url"
              label={t(TRANSLATION_KEY.URL)}
            />
            <Field<keyof Subscription>
              name="name"
              label={`${t(TRANSLATION_KEY.FORM_NAME)}(${t(
                TRANSLATION_KEY.FORM_OPTIONAL,
              )})`}
            />
            <Field<keyof Subscription>
              name="remark"
              label={`${t(TRANSLATION_KEY.REMARK)}(${t(
                TRANSLATION_KEY.FORM_OPTIONAL,
              )})`}
            />
            <div className={styles.buttonContainer}>
              <Button onClick={close} className={styles.button}>
                {t(TRANSLATION_KEY.FORM_CANCEL)}
              </Button>
              <Button
                className={styles.button}
                disabled={!isValid || (isSelected && isStarted) || loading}
                onClick={submitForm}
                appearance="primary"
              >
                {loading && (
                  <Spinner size="extra-tiny" className={styles.spinner} />
                )}
                {t(TRANSLATION_KEY.FORM_SAVE)}
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}

export default SubscriptionModal;
