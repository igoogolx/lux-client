import * as React from "react";
import classNames from "classnames";
import styles from "./index.module.css";

export enum DotTypeEnum {
  Enabled = "enabled",
  Disabled = "disabled",
}
type DotProps = {
  className?: string;
  type?: DotTypeEnum;
};

export function Dot(props: DotProps): React.ReactNode {
  const { className, type = DotTypeEnum.Disabled } = props;
  return <div className={classNames(className, styles[type])} />;
}
