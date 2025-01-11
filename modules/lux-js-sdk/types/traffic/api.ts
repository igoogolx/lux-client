import type WsClient from "isomorphic-ws";

export interface TrafficItem {
  download: number;
  upload: number;
}

export interface Traffic {
  speed: {
    proxy: TrafficItem;
    direct: TrafficItem;
  };
  total: {
    proxy: TrafficItem;
    direct: TrafficItem;
  };
}

interface BaseParams {
  onError?: (e: unknown) => void;
  onMessage: (message: Traffic) => void;
  onClose?: () => void;
}

export type SubscribeTraffic = (params: BaseParams) => WsClient;
