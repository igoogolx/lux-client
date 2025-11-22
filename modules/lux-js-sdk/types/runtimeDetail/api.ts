export type RuntimeDnsDetail = {
  addresses: string[];
  servers: string[];
};

export type RuntimeDetail = {
  hubAddress: string;
  directedInterfaceV4Addr: string;
  directedInterfaceName?: string;
  tunInterfaceName?: string;
  localDns?: RuntimeDnsDetail;
  remoteDns?: RuntimeDnsDetail;
  boostDns?: RuntimeDnsDetail;
};

export type GetRuntimeDetail = () => Promise<RuntimeDetail | null>;

export type RuntimeOS = {
  os: string;
};

export type GetRuntimeOS = () => Promise<RuntimeOS>;
