import { ConfigFileDirModal } from "@/components/Modal/ConfigFileDirModal";
import { ResetConfigModal } from "@/components/Modal/ResetConfigModal";
import { useDangerStyles } from "@/hooks";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState } from "@/reducers";
import webviewContext from "@/utils/webviewContext";
import {
  Button,
  Caption1,
  Card,
  mergeClasses,
  Subtitle2,
} from "@fluentui/react-components";
import { getConfigFileDir, resetConfigFile } from "lux-js-sdk";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styles from "../index.module.css";

export default function ConfigFile() {
  const { t } = useTranslation();
  const [isOpenConfigModal, setIsOpenConfigModal] = useState(false);
  const [isOpenConfigFileDirModal, setIsOpenConfigFileDirModal] =
    useState(false);

  const [configFileDir, setConfigFileDir] = useState("");

  const handleReset = async () => {
    await resetConfigFile();
    window.location.reload();
  };

  const inlineStyles = useDangerStyles();
  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared,
  );

  useEffect(() => {
    getConfigFileDir().then((res) => {
      setConfigFileDir(res);
    });
  }, []);

  return (
    <Card className={styles.card}>
      {isOpenConfigFileDirModal && (
        <ConfigFileDirModal
          value={configFileDir}
          onCancel={() => setIsOpenConfigFileDirModal(false)}
        />
      )}
      {isOpenConfigModal && (
        <ResetConfigModal
          onCancel={() => {
            setIsOpenConfigModal(false);
          }}
          onConfirm={handleReset}
        />
      )}
      <div className={styles.cardItem}>
        <div className={styles.desc}>
          <Subtitle2>{t(TRANSLATION_KEY.CONFIG_FILE)}</Subtitle2>
          <Caption1>{t(TRANSLATION_KEY.CONFIG_FILE_TIP)}</Caption1>
        </div>

        <div>
          <Button
            onClick={() => {
              setIsOpenConfigModal(true);
            }}
            className={mergeClasses(
              styles.actionBtn,
              isStarted ? "" : inlineStyles.danger,
            )}
            disabled={isStarted}
          >
            {t(TRANSLATION_KEY.FORM_RESET)}
          </Button>
          <Button
            onClick={() => {
              if (webviewContext.isInWebview) {
                webviewContext.open(configFileDir);
              } else {
                setIsOpenConfigFileDirModal(true);
              }
            }}
            className={styles.actionBtn}
          >
            {t(TRANSLATION_KEY.OPEN_DIR)}
          </Button>
        </div>
      </div>
    </Card>
  );
}
