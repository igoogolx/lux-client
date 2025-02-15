import { NotificationContainer, notifier } from "@/components/Core";
import { Header } from "@/components/Header";
import { ElevateModal } from "@/components/Modal/ElevateModal";
import { Nav } from "@/components/Nav";
import Data from "@/components/pages/Data";
import Rules from "@/components/pages/Rules";
import Splash from "@/components/Splash";
import { useCheckForUpdate, useMedia } from "@/hooks";
import { generalSlice, managerSlice, type RootState } from "@/reducers";
import { APP_CONTAINER_ID, ROUTER_PATH } from "@/utils/constants";
import { formatError } from "@/utils/error";
import axios from "axios";
import { getIsAdmin, getStatus, subscribePing } from "lux-js-sdk";
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
    throw error;
  },
);

export function App(): React.ReactNode {
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(true);

  const isWideScreen = useMedia("(min-width: 640px)");

  const loading = useSelector<RootState, boolean>(
    (state) => state.general.loading,
  );

  const checkForUpdate = useCheckForUpdate();

  getStatus().then((status) => {
    dispatch(
      managerSlice.actions.setIsStarted({ isStarted: status.isStarted }),
    );
  });

  useEffect(() => {
    console.log("init!");
    checkForUpdate().catch((e) => {
      console.error(e);
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
        {isWideScreen && (
          <div className={styles.nav}>
            <Nav />
            <div className={styles.themeSwitch}>
              <ThemeSwitch />
            </div>
          </div>
        )}
        <div className={styles.content}>
          <Header />
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
