import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { Button } from "@fluentui/react-components";
import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

interface NoneProps {
  close: () => void;
  onChange: () => void;
}

export function NonePlugin(props: Readonly<NoneProps>) {
  const { t } = useTranslation();
  const { close, onChange } = props;
  const onSubmit = async () => {
    onChange();
    close();
  };

  return (
    <div className={styles.buttonContainer}>
      <Button onClick={close} className={styles.button}>
        {t(TRANSLATION_KEY.FORM_CANCEL)}
      </Button>
      <Button className={styles.button} onClick={onSubmit} appearance="primary">
        {t(TRANSLATION_KEY.FORM_SAVE)}
      </Button>
    </div>
  );
}
