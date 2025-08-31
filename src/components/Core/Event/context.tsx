import WsClient from "isomorphic-ws";
import { createContext } from "react";

export enum EVENT_TYPE {
  SET_THEME = "set_theme",
  SET_LANGUAGE = "set_language",
  SET_AUTO_LAUNCH = "set_auto_launch",
  OPEN_HOME_DIR = "open_home_dir",
  OPEN_WEB_DASHBOARD = "open_web_dashboard",
  EXIT_APP = "exit_app",
  SET_WEB_DASHBOARD_IS_READY = "set_web_dashboard_is_ready",
}

export class EventHub {
  private wsClient: WsClient;
  constructor(wsClient: WsClient) {
    this.wsClient = wsClient;
  }
  setTheme(value: string) {
    this.wsClient.send(JSON.stringify({ type: EVENT_TYPE.SET_THEME, value }));
  }
  setLanguage(value: string) {
    this.wsClient.send(
      JSON.stringify({ type: EVENT_TYPE.SET_LANGUAGE, value }),
    );
  }
  setAutoLaunch(value: boolean) {
    this.wsClient.send(
      JSON.stringify({ type: EVENT_TYPE.SET_AUTO_LAUNCH, value }),
    );
  }
  openHomeDir() {
    this.wsClient.send(JSON.stringify({ type: EVENT_TYPE.OPEN_HOME_DIR }));
  }
  openWebDashboard() {
    this.wsClient.send(JSON.stringify({ type: EVENT_TYPE.OPEN_WEB_DASHBOARD }));
  }
  exitApp() {
    this.wsClient.send(JSON.stringify({ type: EVENT_TYPE.EXIT_APP }));
  }
  setWebDashboardIsReady() {
    this.wsClient.send(
      JSON.stringify({ type: EVENT_TYPE.SET_WEB_DASHBOARD_IS_READY }),
    );
  }
}

const EventContext = createContext<EventHub | null>(null);

export default EventContext;
