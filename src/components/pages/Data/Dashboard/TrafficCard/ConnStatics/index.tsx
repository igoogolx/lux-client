import * as React from "react";
import styles from "./index.module.css";

export interface ConnStaticsProps {
  value: { tcp: number; udp: number };
}

function ConnStatics(props: Readonly<ConnStaticsProps>) {
  const { value } = props;
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.item}>
          <span className={styles.label}>TCP:</span>
          <span className={styles.value}>{value.tcp}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>UDP:</span>
          <span className={styles.value}>{value.udp}</span>
        </div>
      </div>
    </div>
  );
}

export default ConnStatics;
