import React, { useEffect, useState } from "react";
import { getSetting } from "lux-js-sdk";
import { useDispatch } from "react-redux";
import { settingSlice } from "@/reducers/setting";
import { SettingForm } from "@/components/pages/Setting/Form";
import styles from "./index.module.css";
import Splash from "@/components/Splash";

export default function Setting() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setIsLoading(true);
    getSetting()
      .then((data) => {
        dispatch(settingSlice.actions.setSetting(data));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [dispatch]);

  return <div className={styles.wrapper}>{isLoading ? <Splash/> : <SettingForm />}</div>;
}
