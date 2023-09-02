import * as React from "react";
import classNames from "classnames";
import { useRef } from "react";
import styles from "./index.module.css";

export type SwitchProps = {
  disabled?: boolean;
  checked: boolean;
  onClick: () => void;
};

export function Switch(props: SwitchProps): JSX.Element {
  const { checked, onClick, disabled = false } = props;

  const toggle = useRef<HTMLLabelElement | null>(null);
  const checkbox = useRef<HTMLInputElement | null>(null);
  function handleToggle() {
    onClick();
    if (toggle.current && checkbox.current) {
      toggle.current.classList.toggle("toggled");

      checkbox.current.checked = !checkbox.current.checked;
    }
  }

  return (
    <div className={styles.container}>
      <input
        ref={checkbox}
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={onClick}
      />
      <span
        onClick={handleToggle}
        ref={toggle}
        className={classNames(styles.label, { [styles.disabled]: disabled })}
      >
        <span className={styles.button} />
      </span>
    </div>
  );
}
