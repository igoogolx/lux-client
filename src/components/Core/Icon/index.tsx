import classNames from "classnames";
import * as React from "react";
import SVG from "react-inlinesvg";
import { IconMap, type IconNameEnum } from "./constants";
import styles from "./index.module.css";

export interface IconProps {
  name: IconNameEnum;
  className?: string;
  size?: IconSizeEnum;
}

export enum IconSizeEnum {
  Small = "small",
  Normal = "normal",
  Large = "large",
  Medium = "medium",
}

export function Icon(props: Readonly<IconProps>): React.ReactNode {
  const { name, className, size = IconSizeEnum.Normal } = props;
  return (
    <div className={classNames(className, styles[size])}>
      <SVG
        src={IconMap[name]}
        className={classNames(styles[size], styles.svg)}
      />
    </div>
  );
}

export * from "./constants";
