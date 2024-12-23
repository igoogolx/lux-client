import { settingSlice } from "@/reducers";
import { Button } from "@fluentui/react-components";
import { NavigationFilled } from "@fluentui/react-icons";
import { getSetting } from "lux-js-sdk";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import styles from "./index.module.css";

interface HeaderProps {
  isNavOpen: boolean;
  setIsNavOpen: (isOpen: boolean) => void;
}

export function Header(props: HeaderProps) {
  const { setIsNavOpen, isNavOpen } = props;

  const dispatch = useDispatch();

  useEffect(() => {
    getSetting().then((data) => {
      dispatch(settingSlice.actions.setSetting(data));
    });
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <div className={styles.navigationBtn}>
        <Button
          icon={<NavigationFilled />}
          onClick={() => {
            setIsNavOpen(!isNavOpen);
          }}
        />
      </div>
    </div>
  );
}
