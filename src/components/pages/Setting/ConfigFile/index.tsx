import React from "react";
import { Button, Caption1, Card, Subtitle2 } from "@fluentui/react-components";
import { useTranslation } from "react-i18next";
import { openConfigFileDir } from "lux-js-sdk";
import { TRANSLATION_KEY } from "../../../../i18n/locales/key";
import styles from "../index.module.css";

export default function ConfigFile() {
  const { t } = useTranslation();

  return (
    <Card className={styles.card}>
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.CONFIG_FILE)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.CONFIG_FILE_TIP)}</Caption1>
        </div>
        <Button
          onClick={() => {
            openConfigFileDir();
          }}
        >
          {t(TRANSLATION_KEY.OPEN_DIR)}
        </Button>
      </div>
    </Card>
  );
}
