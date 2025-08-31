import type WsClient from "isomorphic-ws";

interface EventParams {
  onError?: (e: unknown) => void;
  onMessage: (message: string) => void;
  onClose?: () => void;
}

export type SubscribeEvent = (params: EventParams) => WsClient;
