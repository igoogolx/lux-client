import React from "react";
import { convertByte } from "@/utils/traffic";
import styles from "./index.module.css";

export enum FlowTextTypeEnum {
  Speed,
  Total,
}

type FlowTextProps = {
  value: number;
  type?: FlowTextTypeEnum;
};

export function FlowText(props: FlowTextProps): JSX.Element {
  const { value, type = FlowTextTypeEnum.Speed } = props;
  const { value: convertedValue, unit } = convertByte(value);
  return (
    <span className={styles.wrapper}>
      <span className={styles.value}>{convertedValue}</span>
      <span className={styles.unit}>
        {type === FlowTextTypeEnum.Speed ? `${unit}/S` : unit}
      </span>
    </span>
  );
}
