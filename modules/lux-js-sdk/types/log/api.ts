import type WsClient from "isomorphic-ws";

export interface Log {
  level: string;
  time: number;
  msg: string;
}

export const LogLevel = {
  error: "3",
  warning: "2",
  info: "1",
  debug: "0",
};

export interface LogParams {
  onError?: (e: unknown) => void;
  onMessage: (message: Log[]) => void;
  onClose?: () => void;
}

export type SubscribeLog = (params: LogParams) => WsClient;

export type GetLogsDir = () => Promise<string>;
