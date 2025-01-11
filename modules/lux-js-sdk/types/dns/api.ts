import type WsClient from "isomorphic-ws";

export interface DnsStatisticItem {
  success: number;
  fail: number;
}

export interface DnsStatistic {
  proxy: DnsStatisticItem;
  direct: DnsStatisticItem;
}

interface BaseParams {
  onError?: (e: unknown) => void;
  onMessage: (message: DnsStatistic) => void;
  onClose?: () => void;
}

export type SubscribeDnsStatistic = (params: BaseParams) => WsClient;
