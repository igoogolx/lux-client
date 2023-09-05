import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Caption1,
  Divider,
  Link,
  Title2,
} from "@fluentui/react-components";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import {
  LATEST_RELEASE_URL,
  REPOSITORY_ISSUE_URL,
  REPOSITORY_URL,
} from "@/utils/constants";
import { getVersion } from "@/utils/version";
import { HomeMoreRegular, BugRegular } from "@fluentui/react-icons";
import {
  ConfirmModal,
  Icon,
  IconNameEnum,
  IconSizeEnum,
  notifier,
} from "../../Core";
import checkForUpdate from "../../../utils/checkForUpdate";
import styles from "./index.module.css";

export default function About(): React.ReactNode {
  const { t } = useTranslation();
  const version = getVersion();
  const [hasLatestVersion, setHasLatestVersion] = useState(false);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

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
      <div className={styles.appHeader}>
        <div className={styles.appDesc}>
          <div>
            <Icon name={IconNameEnum.Logo} size={IconSizeEnum.Large} />
          </div>
          <div className={styles.desc}>
            <Title2>Lux App</Title2>
            <Caption1>{version || "none"}</Caption1>
          </div>
        </div>
        <div>
          <Button
            onClick={onCheckForUpdate}
            disabled={isCheckingUpdate}
            appearance="secondary"
            className={styles.btn}
          >
            {t(TRANSLATION_KEY.CHECK_UPDATE)}
          </Button>
        </div>
      </div>
      <Divider className={styles.divider} />
      <div className={styles.links}>
        <div>
          <Button
            onClick={() => {
              window.open(REPOSITORY_URL);
            }}
            appearance="transparent"
            icon={<HomeMoreRegular />}
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link>Lux App Home Page</Link>
          </Button>
        </div>

        <div>
          <Button
            onClick={() => {
              window.open(REPOSITORY_ISSUE_URL);
            }}
            appearance="transparent"
            icon={<BugRegular />}
          >
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link>Report an issue</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
