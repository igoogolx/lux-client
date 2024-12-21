import React from "react";
import classNames from "classnames";
import styles from "./index.module.css";

export enum TagTypeEnum {
  Success = "success",
  Warning = "warning",
  Info = "info",
  Error = "error",
}

interface TagProps {
  type: TagTypeEnum;
  value: string;
}

function Tag(props: TagProps): React.ReactNode {
  const { type, value } = props;
  return (
    <div className={classNames(styles.base, styles[type])}>
      <div>{value}</div>
    </div>
  );
}

export default Tag;
