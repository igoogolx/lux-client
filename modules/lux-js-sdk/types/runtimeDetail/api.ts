export type RuntimeDnsDetail = {
  addresses: string[];
  servers: string[];
};

export type RuntimeDetail = {
  directedInterfaceName: string;
  tunInterfaceName: string;
  localDns: RuntimeDnsDetail;
  remoteDns: RuntimeDnsDetail;
  boostDns: RuntimeDnsDetail;
  hubAddress: string;
};

export type GetRuntimeDetail = () => Promise<RuntimeDetail | null>;

export type RuntimeOS = {
  os: string;
};

export type GetRuntimeOS = () => Promise<RuntimeOS>;
