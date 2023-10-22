import React, { useEffect } from "react";
import { getSetting } from "lux-js-sdk";
import { useDispatch } from "react-redux";
import { generalSlice, settingSlice } from "@/reducers";
import { SettingForm } from "./Form";
import styles from "./index.module.css";

export default function Setting() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(generalSlice.actions.setLoading({ loading: true }));
    getSetting()
      .then((data) => {
        dispatch(settingSlice.actions.setSetting(data));
      })
      .finally(() => {
        dispatch(generalSlice.actions.setLoading({ loading: false }));
      });
  }, [dispatch]);

  return (
    <div className={styles.wrapper}>
      <SettingForm />
    </div>
  );
}
