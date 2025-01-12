import MobileNav from "@/components/Nav/Mobile";
import { settingSlice } from "@/reducers";
import { getSetting } from "lux-js-sdk";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./index.module.css";

export function Header() {
  const dispatch = useDispatch();

  useEffect(() => {
    getSetting().then((data) => {
      dispatch(settingSlice.actions.setSetting(data));
    });
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.navigationBtn}>
        <MobileNav />
      </div>
    </div>
  );
}
