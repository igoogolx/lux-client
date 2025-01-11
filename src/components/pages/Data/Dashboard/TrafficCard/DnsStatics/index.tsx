import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { DnsStatistic } from "lux-js-sdk";
import * as React from "react";
import { useTranslation } from "react-i18next";
import styles from "./index.module.css";
import DnsStaticItem from "./Item";

interface DnsStaticsProps {
  value: DnsStatistic;
}

function DnsStatics(props: Readonly<DnsStaticsProps>) {
  const { value } = props;
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.item}>
          {t(TRANSLATION_KEY.REMOTE_DNS_LABEL)}:
          <DnsStaticItem
            className={styles.value}
            successCount={value.proxy.success}
            failCount={value.proxy.fail}
          />
        </div>
        <div className={styles.item}>
          {t(TRANSLATION_KEY.LOCAL_DNS_LABEL)}:
          <DnsStaticItem
            className={styles.value}
            successCount={value.direct.success}
            failCount={value.direct.fail}
          />
        </div>
      </div>
    </div>
  );
}

export default DnsStatics;
