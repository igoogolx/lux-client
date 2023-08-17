type DnsServer = {
  value: string;
  type: "builtIn" | "custom";
};

export type SettingRes = {
  dns: {
    boost: DnsServer;
    remote: DnsServer;
    local: DnsServer;
  };
  defaultInterface: string;
  trueProxyServer: string;
  localServer: {
    http: { enabled: boolean; port: number };
  };
  autoMode: {
    enabled: boolean;
    type: "url-test" | "fallback";
    url: string;
  };
};

export type GetSetting = () => Promise<SettingRes>;

export type SetSetting = (data: SettingRes) => Promise<void>;

export type NetworkInterface = { Name: string };

export type GetSettingInterfaces = () => Promise<NetworkInterface[]>;

export type GetConfigFileDir = () => Promise<string>;

export type OpenConfigFileDir = () => Promise<void>;

export type GetExecutablePath = () => Promise<string>;
