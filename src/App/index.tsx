import { NotificationContainer, notifier } from "@/components/Core";
import { Header } from "@/components/Header";
import { ElevateModal } from "@/components/Modal/ElevateModal";
import { Nav } from "@/components/Nav";
import Data from "@/components/pages/Data";
import Rules from "@/components/pages/Rules";
import Splash from "@/components/Splash";
import { useCheckForUpdate, useMedia } from "@/hooks";
import { getLang } from "@/i18n";
import { generalSlice, managerSlice, type RootState } from "@/reducers";
import { APP_CONTAINER_ID, ROUTER_PATH } from "@/utils/constants";
import { formatError } from "@/utils/error";
import { ThemeContext, type ThemeContextType } from "@/utils/theme";
import webviewContext from "@/utils/webviewContext";
import axios from "axios";
import clsx from "classnames";
import i18n from "i18next";
import { getIsAdmin, getSetting, getStatus, subscribePing } from "lux-js-sdk";
import * as React from "react";
import { useCallback, useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import CheckHubAddressModal from "../components/Modal/EditHubAddressModal";
import About from "../components/pages/About";
import Home from "../components/pages/Home";
import Logger from "../components/pages/Logger";
import Setting from "../components/pages/Setting";
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
  const [isReady, setIsReady] = useState(false);

  const isWideScreen = useMedia("(min-width: 640px)");

  const loading = useSelector<RootState, boolean>(
    (state) => state.general.loading,
  );

  const checkForUpdate = useCheckForUpdate();

  const { setTheme: setCurrentTheme } = useContext(
    ThemeContext,
  ) as ThemeContextType;

  const updateStatus = useCallback(async () => {
    const status = await getStatus();
    dispatch(
      managerSlice.actions.setIsStarted({ isStarted: status.isStarted }),
    );
  }, [dispatch]);

  const updateIsAdmin = useCallback(async () => {
    const isAdminRes = await getIsAdmin();
    dispatch(generalSlice.actions.setIsAdmin({ isAdmin: isAdminRes.isAdmin }));
  }, [dispatch]);

  const updateI18n = useCallback(async (language: string) => {
    await i18n.changeLanguage(getLang(language));
  }, []);

  const init = useCallback(async () => {
    console.log("init!");

    try {
      setIsReady(false);
      const setting = await getSetting();
      setCurrentTheme(setting.theme);
      await Promise.all([
        updateStatus(),
        updateIsAdmin(),
        updateI18n(setting.language),
      ]);
    } finally {
      setIsReady(true);
      dispatch(generalSlice.actions.setLoading({ loading: false }));
    }
  }, [dispatch, setCurrentTheme, updateI18n, updateIsAdmin, updateStatus]);

  useEffect(() => {
    if (webviewContext.isInWebview) {
      webviewContext.ready();
    }
  }, []);

  useEffect(() => {
    checkForUpdate().catch((e) => {
      console.error(e);
    });
  }, [checkForUpdate]);

  useEffect(() => {
    init().catch((e) => {
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

    return () => {
      //clean ping because of React will run effect twice on development
      pingSubscriber.onerror = null;
      pingSubscriber.close();
    };
  }, [dispatch, init]);

  return !connected ? (
    <CheckHubAddressModal />
  ) : (
    <div
      className={clsx(styles.wrapper, !isReady && styles.hidePage)}
      id={APP_CONTAINER_ID}
    >
      <NotificationContainer />
      <ElevateModal />
      {loading && <Splash />}
      <div className={styles.body}>
        {isWideScreen && (
          <div className={styles.nav}>
            <Nav />
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
