import { Icon, IconNameEnum } from "@/components/Core";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import clsx from "classnames";
import { type TrafficItem } from "lux-js-sdk";
import React from "react";
import { useTranslation } from "react-i18next";
import { FlowText, FlowTextTypeEnum } from "../FlowText";
import styles from "./index.module.css";

interface FlowInfoProps {
  current: TrafficItem;
  total: TrafficItem;
  titleClassName?: string;
}

export default function FlowInfo(props: Readonly<FlowInfoProps>) {
  const { current, total, titleClassName } = props;
  const { t } = useTranslation();
  return (
    <div className={styles.flowInfo}>
      <div className={styles.item}>
        <div className={clsx(styles.title, titleClassName)}>
          {t(TRANSLATION_KEY.SPEED)}:
        </div>
        <div className={styles.details}>
          <div className={styles.detail}>
            <Icon name={IconNameEnum.ArrowDown} />
            <FlowText value={current.download} />
          </div>
          <div className={styles.detail}>
            <Icon name={IconNameEnum.ArrowUp} />
            <FlowText value={current.upload} />
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <div className={clsx(styles.title, titleClassName)}>
          {t(TRANSLATION_KEY.TOTAL)}:
        </div>
        <div className={styles.details}>
          <div className={styles.detail}>
            <Icon name={IconNameEnum.ArrowDown} />
            <FlowText value={total.download} type={FlowTextTypeEnum.Total} />
          </div>
          <div className={styles.detail}>
            <Icon name={IconNameEnum.ArrowUp} />
            <FlowText value={total.upload} type={FlowTextTypeEnum.Total} />
          </div>
        </div>
      </div>
    </div>
  );
}
