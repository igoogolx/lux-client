import * as React from "react";
import SVG from "react-inlinesvg";
import classNames from "classnames";
import { IconMap, IconNameEnum } from "./constants";
import styles from "./index.module.css";

export type IconProps = {
  name: IconNameEnum;
  className?: string;
  size?: IconSizeEnum;
};

export enum IconSizeEnum {
  Small = "small",
  Normal = "normal",
  Large = "large",
  Medium = "medium",
}

export function Icon(props: IconProps): JSX.Element {
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
