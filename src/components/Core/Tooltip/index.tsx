import React from "react";
import classNames from "classnames";
import { PlacementEnum, Popover } from "../Popover";
import styles from "./index.module.css";

export enum TooltipThemeEnum {
  Dark = "dark",
  Light = "light",
}

type TooltipProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  theme?: TooltipThemeEnum;
  disabled?: boolean;
  timeout?: number;
  placement?: PlacementEnum;
  className?: string;
};

export function Tooltip(props: TooltipProps): JSX.Element {
  const {
    children,
    content,
    theme = TooltipThemeEnum.Dark,
    disabled = false,
    timeout = 500,
    placement,
    className,
  } = props;
  return (
    <Popover
      content={content}
      placement={placement}
      popoverClassName={classNames(styles[theme], styles.container)}
      disabled={disabled || !content}
      timeout={timeout}
      className={className}
    >
      {children}
    </Popover>
  );
}
