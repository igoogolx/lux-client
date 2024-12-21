import type WsClient from "isomorphic-ws";

export interface Log {
  id: string;
  type: string;
  time: number;
  payload: string;
}

export enum Level {
  Info = "info",
  Warning = "warning",
  Error = "error",
  Debug = "debug",
  Silent = "silent",
}

export interface LogParams {
  onError?: (e: unknown) => void;
  onMessage: (message: Log[]) => void;
  onClose?: () => void;
  level?: Level;
}

export type SubscribeLog = (params: LogParams) => WsClient;

export type GetLogsDir = () => Promise<string>;
