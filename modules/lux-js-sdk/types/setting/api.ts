export interface SettingRes {
  mode: string;
  language: string;
  dns: {
    disableCache: boolean;
    server: {
      boost: string[];
      local: string[];
      remote: string[];
    };
    customizedOptions: string[];
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
}

export type GetSetting = () => Promise<SettingRes>;

export type SetSetting = (data: SettingRes) => Promise<void>;

export interface NetworkInterface {
  Name: string;
}

export type GetSettingInterfaces = () => Promise<NetworkInterface[]>;

export type GetConfigFileDir = () => Promise<string>;

export type ResetConfig = () => Promise<void>;

export type GetExecutablePath = () => Promise<string>;
