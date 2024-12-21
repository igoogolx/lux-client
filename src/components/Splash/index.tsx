import React from "react";
import { Icon, IconNameEnum } from "../Core";
import styles from "./index.module.css";

export default function Splash(): React.ReactNode {
  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <Icon name={IconNameEnum.Spin} className={styles.icon} />
    </div>
  );
}
