import AddDnsOptionModal from "@/components/Modal/AddDnsOptionModal";
import TunTag from "@/components/pages/Setting/TunTag";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { type RootState } from "@/reducers";
import {
  Button,
  Caption1,
  mergeClasses,
  Subtitle2,
} from "@fluentui/react-components";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styles from "../../index.module.css";

export default function AddDnsOption() {
  const isStarted = useSelector<RootState, boolean>(
    (state) => state.manager.isStared || state.manager.isLoading,
  );
  const { t } = useTranslation();
  const [isOpenConfigModal, setIsOpenConfigModal] = useState(false);
  return (
    <div className={styles.cardItem}>
      {isOpenConfigModal && (
        <AddDnsOptionModal
          close={() => {
            setIsOpenConfigModal(false);
          }}
        />
      )}
      <div className={styles.desc}>
        {
          <Subtitle2>
            {t(TRANSLATION_KEY.DNS_OPTION_TITLE)}
            <TunTag />
          </Subtitle2>
        }
        <Caption1>{t(TRANSLATION_KEY.DNS_OPTION_DESC)}</Caption1>
      </div>
      <div>
        <Button
          onClick={() => {
            setIsOpenConfigModal(true);
          }}
          className={mergeClasses(styles.actionBtn)}
          disabled={isStarted}
        >
          {t(TRANSLATION_KEY.COMMON_EDIT)}
        </Button>
      </div>
    </div>
  );
}
