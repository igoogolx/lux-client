import { type TrafficItem } from "lux-js-sdk";
import * as React from "react";
import FlowInfo from "./FlowInfo";
import styles from "./index.module.css";

interface TrafficCardProps {
  speed: { proxy: TrafficItem; direct: TrafficItem };
  total: { proxy: TrafficItem; direct: TrafficItem };
  connectionsAmount: {
    tcp: number;
    udp: number;
  };
}

export function TrafficCard(
  props: Readonly<TrafficCardProps>,
): React.ReactNode {
  const { speed, total, connectionsAmount } = props;

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
              current={speed.proxy}
              total={total.proxy}
              titleClassName={styles.proxyTitle}
            />
          </div>
        </div>
        <div className={styles.info}>
          <div className={styles.content}>
            <FlowInfo
              current={speed.direct}
              total={total.direct}
              titleClassName={styles.directTitle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
