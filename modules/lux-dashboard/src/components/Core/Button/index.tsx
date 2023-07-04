import * as React from "react";
import classNames from "classnames";
import { MouseEventHandler, useCallback } from "react";
import styles from "./index.module.css";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  buttonType?: ButtonTypeEnum;
  disabled?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "id">;

export enum ButtonTypeEnum {
  Primary = "primary",
  Secondary = "secondary",
  Blank = "blank",
  Link = "link",
}

export function Button(props: ButtonProps): JSX.Element {
  const {
    children,
    className,
    onClick,
    buttonType = ButtonTypeEnum.Primary,
    disabled = false,
    type = "button",
    ...restProps
  } = props;
  const handleOnClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      if (onClick && !disabled) {
        onClick(e);
      }
    },
    [disabled, onClick]
  );
  return (
    <button
      className={classNames(styles.base, className, styles[buttonType], {
        [styles.disabled]: disabled,
      })}
      onClick={handleOnClick}
      type={type}
      {...restProps}
    >
      {children}
    </button>
  );
}
