import React from "react";
import DefaultInterface from "./DefaultInterface";
import TrueProxyServer from "./TrueProxyServer";
import AutoMode from "./AutoMode";
import LocalHttpServer from "./LocalHttpServer";
import Dns from "./Dns";
import ConfigFile from "./ConfigFile";
import styles from "./index.module.css";

export function SettingForm() {
  return (
    <div className={styles.form}>
      <div className={styles.fields}>
        <Dns />
        <DefaultInterface />
        <TrueProxyServer />
        <LocalHttpServer />
        <AutoMode />
        <ConfigFile />
      </div>
    </div>
  );
}
