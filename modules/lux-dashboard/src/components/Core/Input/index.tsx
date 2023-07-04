import { ChangeEvent, ReactNode } from "react";
import classNames from "classnames";
import * as React from "react";
import styles from "./index.module.css";

export type InputProps = {
  label?: React.ReactNode;
  errorMsg?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  size?: INPUT_SIZE;
  adornment?: ReactNode;
  borderLess?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">;

export enum INPUT_SIZE {
  AUTO = "sizeAuto",
  S = "sizeS",
  M = "sizeM",
  L = "sizeL",
  FULL = "sizeFULL",
}

function Input(props: InputProps) {
  const {
    value,
    label,
    errorMsg,
    className,
    size = INPUT_SIZE.AUTO,
    adornment,
    borderLess = false,
    ...restProps
  } = props;

  const cls = classNames(styles.container, styles[size], className, {
    [styles.error]: errorMsg,
  });

  return (
    <div className={cls}>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.content}>
        {adornment && <div className={styles.adornment}>{adornment}</div>}
        <input
          value={value}
          className={classNames(styles.input, {
            [styles.inputBorder]: !borderLess,
          })}
          {...restProps}
        />
      </div>
      {errorMsg && <div className={styles.errorText}>{errorMsg}</div>}
    </div>
  );
}

const InputMemo = React.memo(Input);

export { InputMemo as Input };
