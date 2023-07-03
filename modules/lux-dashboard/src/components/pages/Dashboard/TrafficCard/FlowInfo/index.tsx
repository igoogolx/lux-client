import React from "react";
import { Icon, IconNameEnum } from "@/components/Core";
import { TrafficItem } from "lux-js-sdk";
import { FlowText, FlowTextTypeEnum } from "../FlowText";
import styles from "./index.module.css";

type FlowInfoProps = {
  current: TrafficItem;
  total: TrafficItem;
};

export default function FlowInfo(props: FlowInfoProps) {
  const { current, total } = props;
  return (
    <div className={styles.flowInfo}>
      <div className={styles.item}>
        <div className={styles.title}>Speed</div>
        <div className={styles.details}>
          <div className={styles.detail}>
            <Icon name={IconNameEnum.ArrowUp} />
            <FlowText value={current.upload} />
          </div>
          <div className={styles.detail}>
            <Icon name={IconNameEnum.ArrowDown} />
            <FlowText value={current.download} />
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.title}>Total</div>
        <div className={styles.details}>
          <div className={styles.detail}>
            <Icon name={IconNameEnum.ArrowUp} />
            <FlowText value={total.upload} type={FlowTextTypeEnum.Total} />
          </div>
          <div className={styles.detail}>
            <Icon name={IconNameEnum.ArrowDown} />
            <FlowText value={total.download} type={FlowTextTypeEnum.Total} />
          </div>
        </div>
      </div>
    </div>
  );
}
