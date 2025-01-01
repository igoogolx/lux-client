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
  connectionsAmount: {
    tcp: number;
    udp: number;
  };
}

function getCurrent(items: TrafficItem[]) {
  return items.length > 0
    ? items[items.length - 1]
    : { upload: 0, download: 0 };
}

export function TrafficCard(
  props: Readonly<TrafficCardProps>,
): React.ReactNode {
  const { speed, total, connectionsAmount } = props;
  const currentProxy = getCurrent(speed.proxy);
  const currentDirect = getCurrent(speed.direct);

  return (
    <div className={styles.wrapper}>
      <div className={styles.data}>
        <div className={styles.info}>
          <div className={styles.connectionsAmount}>
            <div
              className={styles.connectionItem}
            >{`TCP:  ${connectionsAmount.tcp}`}</div>
            <div
              className={styles.connectionItem}
            >{`UDP:  ${connectionsAmount.udp}`}</div>
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.content}>
            <FlowInfo
              current={currentProxy}
              total={total.proxy}
              titleClassName={styles.proxyTitle}
            />
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.content}>
            <FlowInfo
              current={currentDirect}
              total={total.direct}
              titleClassName={styles.directTitle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
