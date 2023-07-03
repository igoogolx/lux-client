import React from "react";
import DefaultInterface from "@/components/pages/Setting/DefaultInterface";
import TrueProxyServer from "@/components/pages/Setting/TrueProxyServer";
import AutoMode from "@/components/pages/Setting/AutoMode";
import LocalHttpServer from "@/components/pages/Setting/LocalHttpServer";
import Dns from "@/components/pages/Setting/Dns";
import ConfigFile from "@/components/pages/Setting/ConfigFile";
import styles from "./index.module.css";

export function SettingForm() {
  return (
    <div className={styles.form}>
      <>
        <div className={styles.fields}>
          <Dns />
          <DefaultInterface />
          <TrueProxyServer />
          <LocalHttpServer />
          <AutoMode />
          <ConfigFile />
        </div>
      </>
    </div>
  );
}
