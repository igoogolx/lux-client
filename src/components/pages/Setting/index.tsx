import { settingSlice } from "@/reducers";
import { getRuntimeDetail, getSetting } from "lux-js-sdk";
import React, { useEffect, useEffectEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { SettingForm } from "./Form";
import styles from "./index.module.css";

export default function Setting() {
  const dispatch = useDispatch();
  const [lanV4Ip, setLanV4Ip] = useState("");
  const init = useEffectEvent(async () => {
    const [data, runtimeDetail] = await Promise.all([
      getSetting(),
      getRuntimeDetail(),
    ]);
    dispatch(settingSlice.actions.setSetting(data));
    if (runtimeDetail) {
      setLanV4Ip(runtimeDetail.directedInterfaceV4Addr);
    }
  });

  useEffect(() => {
    init();
  }, []);

  return (
    <div className={styles.wrapper}>
      <SettingForm directedInterfaceV4Addr={lanV4Ip} />
    </div>
  );
}
