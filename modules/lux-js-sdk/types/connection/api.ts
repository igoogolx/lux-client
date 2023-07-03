import WsClient from "isomorphic-ws";

export enum ConnNetworkMetaEnum {
  Tcp = "tcp",
  Udp = "udp",
}

export interface Metadata {
  network: ConnNetworkMetaEnum;
  type: number;
  sourceIp: string;
  destinationIP: string;
  sourcePort: number;
  destinationPort: number;
}

export enum ConnRuleEnum {
  Direct = 0,
  Proxy = 1,
}

export interface Conn {
  id: string;
  metadata: Metadata;
  upload: number;
  download: number;
  start: number;
  rule: ConnRuleEnum;
  domain: string;
  process: string;
}

export interface ConnectionsParams {
  onError?: (e: unknown) => void;
  onMessage: (message: Conn[]) => void;
  onClose?: () => void;
}

export type SubscribeConnections = (params: ConnectionsParams) => WsClient;

export type CloseConnection = (info: { id: string }) => Promise<void>;

export type CloseAllConnections = () => Promise<void>;
