import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { getHubAddress, type HubAddress } from "@/utils/hubAddress";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Field, Form, Modal } from "../../Core";
import styles from "./index.module.css";

export default function CheckHubAddressModal(): React.ReactNode {
  const { t } = useTranslation();

  const onSubmit = () => {
    window.location.reload();
  };
  const initialValue = getHubAddress();

  return (
    <Modal>
      <div className={styles.title}>{t(TRANSLATION_KEY.CHECK_HUB_ADDRESS)}</div>
      <Form onSubmit={onSubmit} initialValues={initialValue}>
        {() => {
          return (
            <>
              <Field<keyof HubAddress>
                name="server"
                label={t(TRANSLATION_KEY.FORM_SERVER)}
                disabled
              />
              <Field<keyof HubAddress>
                name="port"
                label={t(TRANSLATION_KEY.FORM_PORT)}
                disabled
              />
              <Field<keyof HubAddress>
                name="token"
                label={t(TRANSLATION_KEY.TOKEN)}
                disabled
              />
            </>
          );
        }}
      </Form>
    </Modal>
  );
}
