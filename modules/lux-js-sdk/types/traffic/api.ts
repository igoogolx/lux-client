import WsClient from "isomorphic-ws";

export interface TrafficItem {
  download: number;
  upload: number;
}

export interface Traffic {
  proxy: TrafficItem;
  direct: TrafficItem;
}

interface BaseParams {
  onError?: (e: unknown) => void;
  onMessage: (message: Traffic) => void;
  onClose?: () => void;
}

export type SubscribeNowTraffic = (params: BaseParams) => WsClient;

export type SubscribeTotalTraffic = (params: BaseParams) => WsClient;
