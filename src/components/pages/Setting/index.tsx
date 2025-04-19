import { settingSlice } from "@/reducers";
import { getSetting } from "lux-js-sdk";
import React, { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { SettingForm } from "./Form";
import styles from "./index.module.css";

export default function Setting() {
  const dispatch = useDispatch();
  const init = useCallback(async () => {
    const data = await getSetting();
    dispatch(settingSlice.actions.setSetting(data));
  }, [dispatch]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <div className={styles.wrapper}>
      <SettingForm />
    </div>
  );
}
