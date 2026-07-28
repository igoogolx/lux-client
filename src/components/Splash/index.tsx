import { Spinner } from "@fluentui/react-components";

import styles from "./index.module.css";

export default function Splash(): React.ReactNode {
  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <Spinner />
    </div>
  );
}
