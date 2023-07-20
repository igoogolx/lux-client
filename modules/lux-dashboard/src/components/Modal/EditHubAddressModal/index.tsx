import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { Field, Modal, Form } from "@/components/Core";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { HubAddress, getHubAddress } from "@/utils/hubAddress";
import styles from "./index.module.css";


export default function CheckHubAddressModal(
): JSX.Element {
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
                disabled={true}
              />
              <Field<keyof HubAddress>
                name="port"
                label={t(TRANSLATION_KEY.FORM_PORT)}
                disabled={true}
              />
            </>
          );
        }}
      </Form>
    </Modal>
  );
}
