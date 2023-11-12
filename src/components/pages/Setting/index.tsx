import React, { useCallback, useEffect, useRef } from "react";
import { getSetting } from "lux-js-sdk";
import { useDispatch } from "react-redux";
import { generalSlice, settingSlice } from "@/reducers";
import { SettingForm } from "./Form";
import styles from "./index.module.css";

export default function Setting() {
  const dispatch = useDispatch();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const init = useCallback(async () => {
    try {
      timer.current = setTimeout(() => {
        dispatch(generalSlice.actions.setLoading({ loading: true }));
        timer.current = null;
      }, 200);
      const data = await getSetting();
      dispatch(settingSlice.actions.setSetting(data));
    } finally {
      if (timer.current) {
        clearTimeout(timer.current);
      } else {
        dispatch(generalSlice.actions.setLoading({ loading: false }));
      }
    }
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
