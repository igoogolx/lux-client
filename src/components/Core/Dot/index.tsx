import classNames from "classnames";
import * as React from "react";
import styles from "./index.module.css";

export enum DotTypeEnum {
  Enabled = "enabled",
  Disabled = "disabled",
}
interface DotProps {
  className?: string;
  type?: DotTypeEnum;
}

export function Dot(props: Readonly<DotProps>): React.ReactNode {
  const { className, type = DotTypeEnum.Disabled } = props;
  return <div className={classNames(className, styles[type])} />;
}
