import * as React from "react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Nav } from "@/components/Nav";
import { Route, Routes } from "react-router-dom";
import { NotificationContainer, notifier } from "@/components/Core";
import { useDispatch } from "react-redux";
import { getIsAdmin, getStatus, subscribeLog, subscribePing } from "lux-js-sdk";
import { loggerSlice } from "@/reducers/logger";
import { generalSlice } from "@/reducers/general";
import { ElevateModal } from "@/components/Modal/ElevateModal";
import axios from "axios";
import { TRANSLATION_KEY } from "@/i18n/locales/key";
import i18next from "i18next";
import WsClient from "isomorphic-ws";
import { delay } from "@/utils/delay";
import ThemeSwitch from "@/components/ThemeSwitch";
import EditHubAddressModal from "@/components/Modal/EditHubAddressModal";
import Splash from "@/components/Splash";
import { ServerConfirmModal } from "@/components/Modal/ServerConfirmModal";
import { managerSlice } from "@/reducers";
import { APP_CONTAINER_ID, ROUTER_PATH } from "@/utils/constants";
import { makeStyles } from "@fluentui/react-components";
import { tokens } from "@fluentui/react-theme";
import { Header } from "@/components/Header";
import classNames from "classnames";
import styles from "./index.module.css";

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    notifier.error(
      error.response?.data?.message || i18next.t(TRANSLATION_KEY.UNKNOWN_ERROR)
    );
    return Promise.reject(error);
  }
);

const RECONNECT_TIMEOUT = 1000;

const Home = lazy(() => import("@/components/pages/Home"));
const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Setting = lazy(() => import("@/components/pages/Setting"));
const Connections = lazy(() => import("@/components/pages/Connections"));
const Logger = lazy(() => import("@/components/pages/Logger"));
const About = lazy(() => import("@/components/pages/About"));

const useStyles = makeStyles({
  nav: {
    backgroundColor: tokens.colorNeutralBackground1,
  },
  expandedNav: {
    backgroundColor: tokens.colorNeutralBackground2,
  },
});

export function App(): JSX.Element {
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(true);
  const pingSubscriber = useRef<WsClient | null>(null);
  const hasDisconnected = useRef(false);
  const [loading, setLoading] = useState(true);

  const [isNavOpen, setIsNavOpen] = useState(false);

  const inlineStyles = useStyles();

  getStatus().then((status) => {
    dispatch(
      managerSlice.actions.setIsStarted({ isStarted: status.isStarted })
    );
  });

  const createPingSubscriber = useCallback(() => {
    pingSubscriber.current = subscribePing({
      onMessage: () => {
        if (hasDisconnected.current) {
          window.location.reload();
        }
        setLoading(false);
        setConnected(true);
      },
      onClose: async () => {
        setConnected(false);
        hasDisconnected.current = true;
        await delay(RECONNECT_TIMEOUT);
        console.log("Trying to reconnect ping");
        createPingSubscriber();
      },
    });
  }, []);
  useEffect(() => {
    createPingSubscriber();
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
      if (pingSubscriber.current) {
        pingSubscriber.current.close();
      }
    };
  }, [createPingSubscriber, dispatch]);
  return (
    <div className={styles.wrapper} id={APP_CONTAINER_ID}>
      <NotificationContainer />
      <ServerConfirmModal />
      {!connected && (
        <EditHubAddressModal
          close={() => {
            setConnected(true);
          }}
        />
      )}
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
          {loading && <Splash />}
          <Header isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />
          <Routes>
            <Route
              path={ROUTER_PATH.Home}
              element={
                <Suspense fallback={<></>}>
                  <Home />
                </Suspense>
              }
            />
            <Route
              path={ROUTER_PATH.Dashboard}
              element={
                <Suspense fallback={<></>}>
                  <Dashboard />
                </Suspense>
              }
            />
            <Route
              path={ROUTER_PATH.Connections}
              element={
                <Suspense fallback={<></>}>
                  <Connections />
                </Suspense>
              }
            />
            <Route
              path={ROUTER_PATH.Logger}
              element={
                <Suspense fallback={<></>}>
                  <Logger />
                </Suspense>
              }
            />
            <Route
              path={ROUTER_PATH.Setting}
              element={
                <Suspense fallback={<></>}>
                  <Setting />
                </Suspense>
              }
            />
            <Route
              path={ROUTER_PATH.About}
              element={
                <Suspense fallback={<></>}>
                  <About />
                </Suspense>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}
