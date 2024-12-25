export type RuntimeDetail = {
  directedInterfaceName: string;
  tunInterfaceName: string;
  localDns: string[];
  remoteDns: string[];
  boostDns: string[];
};

export type GetRuntimeDetail = () => Promise<RuntimeDetail | null>;

export type RuntimeOS = {
  os: string;
};

export type GetRuntimeOS = () => Promise<RuntimeOS>;
