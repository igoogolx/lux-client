import * as React from "react";
import styles from "./index.module.css";

interface DnsStaticsItemProps {
  successCount: number;
  failCount: number;
  className?: string;
}

function convertToPercentage(count: number, total: number) {
  if (count === 0 || total === 0) {
    return 100;
  }
  return ((count / total) * 100).toFixed(0);
}

function DnsStaticItem(props: Readonly<DnsStaticsItemProps>) {
  const { successCount, failCount, className } = props;
  const total = successCount + failCount;
  const percentage = convertToPercentage(successCount, total);
  return (
    <div className={className}>
      {percentage}%<span className={styles.total}>({total})</span>
    </div>
  );
}

export default DnsStaticItem;
