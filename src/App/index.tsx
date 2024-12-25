import { NotificationContainer, notifier } from "@/components/Core";
import { Header } from "@/components/Header";
import { ElevateModal } from "@/components/Modal/ElevateModal";
import { Nav } from "@/components/Nav";
import Data from "@/components/pages/Data";
import Rules from "@/components/pages/Rules";
import Splash from "@/components/Splash";
import { useCheckForUpdate } from "@/hooks";
import {
  generalSlice,
  loggerSlice,
  managerSlice,
  type RootState,
} from "@/reducers";
import { APP_CONTAINER_ID, ROUTER_PATH } from "@/utils/constants";
import { formatError } from "@/utils/error";
import { makeStyles } from "@fluentui/react-components";
import { tokens } from "@fluentui/react-theme";
import axios from "axios";
import classNames from "classnames";
import { getIsAdmin, getStatus, subscribeLog, subscribePing } from "lux-js-sdk";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import CheckHubAddressModal from "../components/Modal/EditHubAddressModal";
import About from "../components/pages/About";
import Home from "../components/pages/Home";
import Logger from "../components/pages/Logger";
import Setting from "../components/pages/Setting";
import ThemeSwitch from "../components/ThemeSwitch";
import styles from "./index.module.css";

axios.interceptors.response.use(
  (res) => res,
  async (error) => {
    notifier.error(formatError(error));
    return await Promise.reject(error);
  },
);

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

  const loading = useSelector<RootState, boolean>(
    (state) => state.general.loading,
  );

  const [isNavOpen, setIsNavOpen] = useState(false);

  const inlineStyles = useStyles();

  const checkForUpdate = useCheckForUpdate();

  getStatus().then((status) => {
    dispatch(
      managerSlice.actions.setIsStarted({ isStarted: status.isStarted }),
    );
  });

  useEffect(() => {
    console.log("init!");
    checkForUpdate();
    const logSubscriber = subscribeLog({
      onMessage: (logs) => {
        logs.forEach((log) => {
          dispatch(loggerSlice.actions.pushLog(log));
        });
      },
      onError: () => {
        logSubscriber.close();
      },
    });
    const pingSubscriber = subscribePing({
      onMessage: (item) => {
        if (item === "pong") {
          setConnected(true);
        }
      },
      onError: () => {
        pingSubscriber.close();
        setConnected(false);
      },
    });
    getIsAdmin().then((res) => {
      dispatch(generalSlice.actions.setIsAdmin({ isAdmin: res.isAdmin }));
    });
    return () => {
      //TODO: clean ping
      logSubscriber.close();
    };
  }, [dispatch, checkForUpdate]);
  return !connected ? (
    <CheckHubAddressModal />
  ) : (
    <div className={styles.wrapper} id={APP_CONTAINER_ID}>
      <NotificationContainer />
      <ElevateModal />
      {loading && <Splash />}
      <div className={styles.body}>
        <div
          className={classNames(
            { [styles.expandedNav]: isNavOpen },
            styles.nav,
            isNavOpen ? inlineStyles.expandedNav : inlineStyles.nav,
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
            <Route path={ROUTER_PATH.Rules} element={<Rules />} />
            <Route path={ROUTER_PATH.Dashboard} element={<Data />} />
            <Route path={ROUTER_PATH.Logger} element={<Logger />} />
            <Route path={ROUTER_PATH.Setting} element={<Setting />} />
            <Route path={ROUTER_PATH.About} element={<About />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
