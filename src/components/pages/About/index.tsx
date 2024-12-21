import React, { useState } from "react";
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
  DOCS_URL,
  LATEST_RELEASE_URL,
  REPOSITORY_ISSUE_URL,
  REPOSITORY_URL,
} from "@/utils/constants";
import { getVersion } from "@/utils/version";
import {
  HomeMoreRegular,
  BugRegular,
  DocumentBulletListRegular,
} from "@fluentui/react-icons";
import { ConfirmModal, Icon, IconNameEnum, IconSizeEnum } from "../../Core";
import styles from "./index.module.css";
import { useCheckForUpdate } from "@/hooks";

export default function About(): React.ReactNode {
  const { t } = useTranslation();
  const version = getVersion();
  const [hasLatestVersion, setHasLatestVersion] = useState(false);

  const onCheckForUpdate = useCheckForUpdate(true);

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
          <Button appearance="transparent" icon={<HomeMoreRegular />}>
            <Link href={REPOSITORY_URL}>
              {t(TRANSLATION_KEY.APP_HOME_PAGE)}
            </Link>
          </Button>
        </div>

        <div>
          <Button appearance="transparent" icon={<BugRegular />}>
            <Link href={REPOSITORY_ISSUE_URL}>
              {t(TRANSLATION_KEY.APP_REPORT_ISSUE)}
            </Link>
          </Button>
        </div>

        <div>
          <Button appearance="transparent" icon={<DocumentBulletListRegular />}>
            <Link href={DOCS_URL}>{t(TRANSLATION_KEY.APP_DOCS)}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
