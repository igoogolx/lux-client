import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getIsAdmin, getStatus, ping, subscribeLog } from "lux-js-sdk";
import axios from "axios";
import i18next from "i18next";
import { makeStyles } from "@fluentui/react-components";
import { tokens } from "@fluentui/react-theme";
import classNames from "classnames";
import { Nav } from "@/components/Nav";
import { NotificationContainer, notifier } from "@/components/Core";
import { generalSlice, loggerSlice, managerSlice } from "@/reducers";
import { ElevateModal } from "@/components/Modal/ElevateModal";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import { ServerConfirmModal } from "@/components/Modal/ServerConfirmModal";
import { Header } from "@/components/Header";
import { APP_CONTAINER_ID, ROUTER_PATH } from "@/utils/constants";
import ThemeSwitch from "../components/ThemeSwitch";
import CheckHubAddressModal from "../components/Modal/EditHubAddressModal";
import styles from "./index.module.css";
import About from "../components/pages/About";
import Setting from "../components/pages/Setting";
import Logger from "../components/pages/Logger";
import Connections from "../components/pages/Connections";
import Dashboard from "../components/pages/Dashboard";
import Home from "../components/pages/Home";

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    notifier.error(
      error.response?.data?.message || i18next.t(TRANSLATION_KEY.UNKNOWN_ERROR)
    );
    return Promise.reject(error);
  }
);

const PING_TIMEOUT = 1000;

const useStyles = makeStyles({
  nav: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  expandedNav: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

export function App(): React.ReactNode {
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(true);

  const timer = useRef<null | ReturnType<typeof setInterval>>(null);

  const [isNavOpen, setIsNavOpen] = useState(false);

  const inlineStyles = useStyles();

  getStatus().then((status) => {
    dispatch(
      managerSlice.actions.setIsStarted({ isStarted: status.isStarted })
    );
  });

  useEffect(() => {
    timer.current = setInterval(async () => {
      try {
        await ping();
        setConnected(true);
      } catch (e) {
        setConnected(false);
      }
    }, PING_TIMEOUT);
    const logSubscriber = subscribeLog({
      onMessage: (m) => {
        dispatch(loggerSlice.actions.pushLog(m));
      },
    });
    getIsAdmin().then((res) => {
      dispatch(generalSlice.actions.setIsAdmin({ isAdmin: res.isAdmin }));
    });
    return () => {
      logSubscriber.close();
    };
  }, [dispatch]);
  return (
    <>
      {!connected ? (
        <CheckHubAddressModal />
      ) : (
        <div className={styles.wrapper} id={APP_CONTAINER_ID}>
          <NotificationContainer />
          <ServerConfirmModal />
          <ElevateModal />
          <div className={styles.body}>
            <div
              className={classNames(
                { [styles.expandedNav]: isNavOpen },
                styles.nav,
                isNavOpen ? inlineStyles.expandedNav : inlineStyles.nav
              )}
            >
              <Nav
                onClick={() => {
                  if (isNavOpen) {
                    setIsNavOpen(false);
                  }
                }}
              />
              <div className={styles.themeSwitch}>
                <ThemeSwitch />
              </div>
            </div>
            <div className={styles.content}>
              <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
              <Routes>
                <Route path={ROUTER_PATH.Home} element={<Home />} />
                <Route path={ROUTER_PATH.Dashboard} element={<Dashboard />} />
                <Route
                  path={ROUTER_PATH.Connections}
                  element={<Connections />}
                />
                <Route path={ROUTER_PATH.Logger} element={<Logger />} />
                <Route path={ROUTER_PATH.Setting} element={<Setting />} />
                <Route path={ROUTER_PATH.About} element={<About />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
