import { DnsStatisticItem } from "lux-js-sdk";
import * as React from "react";
import styles from "./index.module.css";

interface DnsStaticsProps {
  value: DnsStatisticItem;
}

function DnsStatics(props: Readonly<DnsStaticsProps>) {
  const { value } = props;
  return (
    <div className={styles.container}>
      <div className={styles.body}>
        <div className={styles.item}>
          <span className={styles.label}>Success Dns:</span>
          <span className={styles.value}>{value.success}</span>
        </div>
        <div className={styles.item}>
          <span className={styles.label}>Fail Dns:</span>
          <span className={styles.value}>{value.fail}</span>
        </div>
      </div>
    </div>
  );
}

export default DnsStatics;
