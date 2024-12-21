import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { Button } from "@fluentui/react-components";
import { type Obfs, ObfsModeEnum } from "lux-js-sdk";
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Field, FiledSelector, Form } from "../../../../Core";
import { ObfsPluginSchema } from "../../EditShadowsocksModal/validate";
import styles from "./index.module.css";

interface EditObfsProps {
  close: () => void;
  initialValue: NonNullable<Obfs>;
  onChange: (data: Obfs) => void;
}

export function EditObfsPlugin(props: EditObfsProps) {
  const { t } = useTranslation();
  const { close, initialValue, onChange } = props;
  const onSubmit = async (data: Obfs) => {
    onChange(data);
    close();
  };

  const modeOption = useRef([
    {
      id: ObfsModeEnum.Http,
      content: "Http",
    },
    {
      id: ObfsModeEnum.Tls,
      content: "Tls",
    },
  ]);

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValue}
      validationSchema={ObfsPluginSchema}
    >
      {({ submitForm }) => {
        return (
          <>
            <Field name="host" label={t(TRANSLATION_KEY.HOST)} />
            <FiledSelector
              name="mode"
              label={t(TRANSLATION_KEY.MODE)}
              items={modeOption.current}
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
