import WsClient from "isomorphic-ws";

export interface PingParams {
  onError?: (e: unknown) => void;
  onMessage: (message: string) => void;
  onClose?: () => void;
}

export type SubscribePing = (params: PingParams) => WsClient;
