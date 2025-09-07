import { PROXY_MODE_ENUM } from "@/utils/constants";
import { ThemeEnum } from "@/utils/theme";

export interface SettingRes {
  mode: PROXY_MODE_ENUM;
  language: string;
  dns: {
    disableCache: boolean;
    server: {
      boost: string[];
      local: string[];
      remote: string[];
    };
    customizedOptions: string[];
    fakeIp: boolean;
  };
  defaultInterface: string;
  localServer: {
    allowLan: boolean;
    port: number;
  };
  autoMode: {
    enabled: boolean;
    type: "url-test" | "fallback";
    url: string;
  };
  hijackDns: {
    enabled: boolean;
    networkService: string;
    alwaysReset: boolean;
  };
  blockQuic: boolean;
  stack: string;
  shouldFindProcess: boolean;
  theme: ThemeEnum;
  autoLaunch: boolean;
  autoConnect: boolean;
  sensitiveInfoMode: boolean;
  keepConnectedWhenSlept: boolean;
}

export type GetSetting = () => Promise<SettingRes>;

export type SetSetting = (data: SettingRes) => Promise<void>;

export interface NetworkInterface {
  Name: string;
}

export type GetSettingInterfaces = () => Promise<NetworkInterface[]>;

export type GetConfigFileDir = () => Promise<string>;

export type ResetConfig = () => Promise<void>;
