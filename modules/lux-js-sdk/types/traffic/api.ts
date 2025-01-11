import type WsClient from "isomorphic-ws";

export interface TrafficItem {
  download: number;
  upload: number;
}

export interface TrafficData {
  proxy: TrafficItem;
  direct: TrafficItem;
}

export interface Traffic {
  speed: TrafficData;
  total: TrafficData;
}

interface BaseParams {
  onError?: (e: unknown) => void;
  onMessage: (message: Traffic) => void;
  onClose?: () => void;
}

export type SubscribeTraffic = (params: BaseParams) => WsClient;
