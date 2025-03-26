import { Tag, TagTypeEnum } from "@/components/Core";
import React from "react";
import styles from "./index.module.css";

export default function TunTag() {
  return (
    <Tag
      type={TagTypeEnum.Success}
      value={"Tun"}
      className={styles.container}
    />
  );
}
