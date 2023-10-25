import * as React from "react";
import { TrafficItem } from "lux-js-sdk";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { useTranslation } from "react-i18next";
import FlowInfo from "./FlowInfo";
import styles from "./index.module.css";
import { SpeedGraph } from "../SpeedGraph";

export enum TrafficCardTypeEnum {
  Proxy,
  Direct,
}

type TrafficCardProps = {
  speed: { proxy: TrafficItem[]; direct: TrafficItem[] };
  total: { proxy: TrafficItem; direct: TrafficItem };
};

function getCurrent(items: TrafficItem[]) {
  return items.length ? items[items.length - 1] : { upload: 0, download: 0 };
}

export function TrafficCard(props: TrafficCardProps): React.ReactNode {
  const { speed, total } = props;
  const currentProxy = getCurrent(speed.proxy);
  const currentDirect = getCurrent(speed.direct);
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.data}>
        <div className={styles.info}>
          <div className={styles.header}>
            <div className={styles.avatar}>{t(TRANSLATION_KEY.PROXY)}</div>
          </div>
          <div className={styles.content}>
            <FlowInfo current={currentProxy} total={total.proxy} />
          </div>
        </div>
        <div className={styles.line} />
        <div className={styles.info}>
          <div className={styles.header}>
            <div className={styles.avatar}>{t(TRANSLATION_KEY.BYPASS)}</div>
          </div>
          <div className={styles.content}>
            <FlowInfo current={currentDirect} total={total.direct} />
          </div>
        </div>
      </div>
      <div className={styles.graph}>
        <SpeedGraph data={speed} />
      </div>
    </div>
  );
}
