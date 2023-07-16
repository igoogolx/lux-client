import React from "react";
import { Field, FieldSwitch, Form } from "@/components/Core";
import { useTranslation } from "react-i18next";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { Button } from "@fluentui/react-components";
import { V2rayObfs } from "lux-js-sdk";
import { V2rayPluginSchema } from "@/components/Modal/Proxy/EditShadowsocksModal/validate";
import styles from "./index.module.css";

type EditV2rayProps = {
  close: () => void;
  initialValue: V2rayObfs;
  onChange: (data: V2rayObfs) => void;
};

export function EditV2rayPlugin(props: EditV2rayProps) {
  const { t } = useTranslation();
  const { close, initialValue, onChange } = props;
  const onSubmit = async (data: V2rayObfs) => {
    onChange(data);
    close();
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValue}
      validationSchema={V2rayPluginSchema}
    >
      {({  submitForm }) => {
        return (
          <>
            <Field name="mode" label={t(TRANSLATION_KEY.MODE)} />
            <Field name="host" label={t(TRANSLATION_KEY.HOST)} />
            <Field name="port" label={t(TRANSLATION_KEY.FORM_PORT)} />
            <Field name="path" label={t(TRANSLATION_KEY.PATH)} />
            <FieldSwitch name="tls" label={t(TRANSLATION_KEY.TLS)} />
            <FieldSwitch
              name="skipCertVerify"
              label={t(TRANSLATION_KEY.SKIP_CERT_VERIFY)}
            />
            <div className={styles.buttonContainer}>
              <Button onClick={close} className={styles.button}>
                {t(TRANSLATION_KEY.FORM_CANCEL)}
              </Button>
              <Button
                className={styles.button}
                onClick={submitForm}
                appearance="primary"
              >
                {t(TRANSLATION_KEY.FORM_SAVE)}
              </Button>
            </div>
          </>
        );
      }}
    </Form>
  );
}
