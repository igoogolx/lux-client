import { type TrafficItem } from "lux-js-sdk";
import * as React from "react";
import FlowInfo from "./FlowInfo";
import styles from "./index.module.css";

export enum TrafficCardTypeEnum {
  Proxy,
  Direct,
}

interface TrafficCardProps {
  speed: { proxy: TrafficItem[]; direct: TrafficItem[] };
  total: { proxy: TrafficItem; direct: TrafficItem };
}

function getCurrent(items: TrafficItem[]) {
  return items.length > 0
    ? items[items.length - 1]
    : { upload: 0, download: 0 };
}

export function TrafficCard(
  props: Readonly<TrafficCardProps>,
): React.ReactNode {
  const { speed, total } = props;
  const currentProxy = getCurrent(speed.proxy);
  const currentDirect = getCurrent(speed.direct);

  return (
    <div className={styles.wrapper}>
      <div className={styles.data}>
        <div className={styles.info}>
          <div className={styles.content}>
            <FlowInfo current={currentProxy} total={total.proxy} />
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.content}>
            <FlowInfo current={currentDirect} total={total.direct} />
          </div>
        </div>
      </div>
    </div>
  );
}
