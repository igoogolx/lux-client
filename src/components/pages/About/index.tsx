import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getVersion as getCoreVersion } from "lux-js-sdk";
import { Button, Link, Text, Title1 } from "@fluentui/react-components";
import { TRANSLATION_KEY } from "../../../i18n/locales/key";
import { LATEST_RELEASE_URL, REPOSITORY_URL } from "../../../utils/constants";
import { ConfirmModal, notifier } from "../../Core";
import checkForUpdate from "../../../utils/checkForUpdate";
import { getVersion } from "../../../utils/version";
import styles from "./index.module.css";

export default function About(): JSX.Element {
  const { t } = useTranslation();
  const version = getVersion();
  const [coreVersion, setCoreVersion] = useState("");
  const [hasLatestVersion, setHasLatestVersion] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  useEffect(() => {
    getCoreVersion().then((data) => {
      setCoreVersion(data.version);
    });
  }, []);

  const onCheckForUpdate = useCallback(async () => {
    try {
      setIsCheckingUpdate(true);
      const checkedResult = await checkForUpdate();
      if (!checkedResult) {
        notifier.info(t(TRANSLATION_KEY.NO_UPDATE_INFO));
      }
      setHasLatestVersion(checkedResult);
    } finally {
      setIsCheckingUpdate(false);
    }
  }, [t]);
  return (
    <div className={styles.container}>
      {hasLatestVersion && (
        <ConfirmModal
          title={t(TRANSLATION_KEY.CONFIRM)}
          content={t(TRANSLATION_KEY.NEW_VERSION_INFO)}
          onCancel={() => {
            setHasLatestVersion(false);
          }}
          confirmText={t(TRANSLATION_KEY.GO)}
          onConfirm={() => {
            window.open(LATEST_RELEASE_URL);
          }}
        />
      )}
      <Title1 as="h1">Lux</Title1>
      <div className={styles.desc}>
        <div>
          <Text className={styles.item}>
            {t(TRANSLATION_KEY.VERSION)}: {version}
          </Text>
          <Text className={styles.item}>
            {t(TRANSLATION_KEY.CORE_VERSION)}: {coreVersion}
          </Text>
        </div>
        <div className={styles.item}>
          <Text>{t(TRANSLATION_KEY.REPOSITORY)}: </Text>
          <Button
            onClick={() => {
              window.open(REPOSITORY_URL);
            }}
            appearance="transparent"
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link>{REPOSITORY_URL}</Link>
          </Button>
        </div>
        <div>
          <Button
            onClick={onCheckForUpdate}
            disabled={isCheckingUpdate}
            appearance="primary"
            className={styles.btn}
          >
            {t(TRANSLATION_KEY.CHECK_UPDATE)}
          </Button>
        </div>
      </div>
    </div>
  );
}
