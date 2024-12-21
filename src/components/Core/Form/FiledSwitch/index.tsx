import { Switch } from "@fluentui/react-components";
import classNames from "classnames";
import { useField } from "formik";
import React from "react";
import styles from "./index.module.css";

interface FieldSwitchProps {
  name: string;
  label?: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export function FieldSwitch(props: FieldSwitchProps) {
  const { name, label, disabled = false, className } = props;

  const [field, , helpers] = useField({ name });
  const { setValue } = helpers;
  const checked = field.value;
  return (
    <div className={classNames(className, styles.container)}>
      {label && <div className={styles.label}>{label}</div>}
      <Switch
        checked={checked}
        onChange={(e) => {
          setValue(e.currentTarget.checked);
        }}
        disabled={disabled}
      />
    </div>
  );
}
