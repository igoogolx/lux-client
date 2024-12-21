import { type BaseProxy } from "./base";

export interface GetProxiesRes {
  proxies: BaseProxy[];
  selectedId: string;
}
export type GetProxies = () => Promise<GetProxiesRes>;

export interface GetCurProxyRes {
  name: string;
  addr: string;
}

export type GetCurProxy = () => Promise<GetCurProxyRes>;

interface GetUpdateProxyReq {
  proxy: BaseProxy;
  id: string;
}
export type UpdateProxy = (req: GetUpdateProxyReq) => Promise<void>;

interface AddProxyReq {
  proxy: Omit<BaseProxy, "id" | "region">;
}

export type AddProxy = (req: AddProxyReq) => Promise<{ id: string }>;

interface addProxiesFromSubscriptionUrlReq {
  proxies: Array<Omit<BaseProxy, "id">>;
  subscriptionUrl: string;
}

export type AddProxiesFromSubscriptionUrl = (
  req: addProxiesFromSubscriptionUrlReq,
) => Promise<{ proxies: BaseProxy[] }>;

interface DeleteProxiesReq {
  ids: string[];
}

export type DeleteProxies = (req: DeleteProxiesReq) => Promise<void>;

export type DeleteAllProxies = () => Promise<void>;

export interface Delay {
  id: string;
  value: number;
}

interface GetProxyDelayReq {
  id: string;
  url?: string;
}
export type GetProxyDelay = (
  req: GetProxyDelayReq,
) => Promise<{ delay: number }>;

interface TestProxyUpdReq {
  id: string;
}
export type TestProxyUdp = (
  req: TestProxyUpdReq,
) => Promise<{ result: boolean }>;

interface GetResFromUrlReq {
  url: string;
}
export type GetResFromUrl = (
  req: GetResFromUrlReq,
) => Promise<{ data: string }>;
