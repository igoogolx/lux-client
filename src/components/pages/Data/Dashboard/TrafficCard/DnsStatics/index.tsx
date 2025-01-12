import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { DnsStatisticItem } from "lux-js-sdk";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";

interface DnsStaticsProps {
  value: DnsStatisticItem;
}

function DnsStatics(props: Readonly<DnsStaticsProps>) {
  const { value } = props;
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.item}>
          <span className={styles.label}>
            {t(TRANSLATION_KEY.SUCCESS_DNS)}:
          </span>
          <span className={styles.value}>{value.success}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>{t(TRANSLATION_KEY.FAIL_DNS)}:</span>
          <span className={styles.value}>{value.fail}</span>
        </div>
      </div>
    </div>
  );
}

export default DnsStatics;
