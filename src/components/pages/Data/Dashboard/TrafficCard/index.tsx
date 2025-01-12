import ConnStatics, {
  ConnStaticsProps,
} from "@/components/pages/Data/Dashboard/TrafficCard/ConnStatics";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { DnsStatistic, type TrafficItem } from "lux-js-sdk";
import * as React from "react";
import { useTranslation } from "react-i18next";
import DnsStatics from "./DnsStatics";
import FlowInfo from "./FlowInfo";
import styles from "./index.module.css";

export interface ConnectionsAmount {
  proxy: ConnStaticsProps["value"];
  direct: ConnStaticsProps["value"];
}

interface TrafficCardProps {
  speed: { proxy: TrafficItem; direct: TrafficItem };
  total: { proxy: TrafficItem; direct: TrafficItem };
  connectionsAmount: ConnectionsAmount;
  dnsStatics: DnsStatistic;
}

export function TrafficCard(
  props: Readonly<TrafficCardProps>,
): React.ReactNode {
  const { speed, total, connectionsAmount, dnsStatics } = props;
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.data}>
        <div className={styles.info}>
          <div className={styles.title}>{t(TRANSLATION_KEY.PROXY)}</div>
        </div>
        <div className={styles.info}>
          <ConnStatics value={connectionsAmount.proxy} />
        </div>
        <div className={styles.info}>
          <DnsStatics value={dnsStatics.proxy} />
        </div>
        <div className={styles.info}>
          <FlowInfo current={speed.proxy} total={total.proxy} />
        </div>
      </div>
      <div className={styles.data}>
        <div className={styles.info}>
          <div className={styles.title}>{t(TRANSLATION_KEY.DIRECT)}</div>
        </div>
        <div className={styles.info}>
          <ConnStatics value={connectionsAmount.direct} />
        </div>
        <div className={styles.info}>
          <DnsStatics value={dnsStatics.direct} />
        </div>
        <div className={styles.info}>
          <FlowInfo current={speed.direct} total={total.direct} />
        </div>
      </div>
    </div>
  );
}
