import React from "react";
import { useField } from "formik";
import classNames from "classnames";
import { Switch, SwitchProps } from "../../Switch";
import styles from "./index.module.css";

type FieldSwitchProps<K> = {
  name: string;
  label?: React.ReactNode;
  className?: string;
  customizedValue?: (value: K) => boolean;
  customizedResult?: (value: boolean) => K;
} & Omit<SwitchProps, "checked" | "onClick">;

export function FieldSwitch<K>(props: FieldSwitchProps<K>) {
  const {
    name,
    label,
    disabled,
    className,
    customizedValue,
    customizedResult,
  } = props;

  const [field, , helpers] = useField({ name });
  const { setValue } = helpers;
  const checked = customizedValue ? customizedValue(field.value) : field.value;
  return (
    <div className={classNames(className, styles.container)}>
      {label && <div className={styles.label}>{label}</div>}
      <Switch
        checked={checked}
        onClick={() => {
          setValue(customizedResult ? customizedResult(!checked) : !checked);
        }}
        disabled={disabled}
      />
    </div>
  );
}
