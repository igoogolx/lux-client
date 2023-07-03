import axios from "axios";
import {
  AddProxiesFromClashConfigUrl,
  AddProxy,
  DeleteAllProxies,
  DeleteProxy,
  GetClashYamlUrl,
  GetProxies,
  GetProxyDelay,
  TestProxyUdp,
  UpdateClashYamlUrl,
  UpdateProxy,
} from "./types";
import { urtConfig } from "./url";

export const getProxies: GetProxies = async () => {
  const url = `${urtConfig.proxies}`;
  const res = await axios.get(url);
  return res.data;
};

export const updateProxy: UpdateProxy = async (req) => {
  const { id, proxy } = req;
  const url = `${urtConfig.proxies}/${id}`;
  await axios.post(url, proxy);
};

export const addProxy: AddProxy = async (req) => {
  const { proxy } = req;
  const url = `${urtConfig.proxies}`;
  const res = await axios.put(url, proxy);
  return res.data;
};

export const addProxiesFromClashUrlConfig: AddProxiesFromClashConfigUrl =
  async (req) => {
    const url = `${urtConfig.proxies}/clash-url`;
    const res = await axios.put(url, req);
    return res.data;
  };

export const updateClashYamlUrl: UpdateClashYamlUrl = async (req) => {
  const url = `${urtConfig.proxies}/clash-yaml-url`;
  const res = await axios.post(url, req);
  return res.data;
};

export const getClashYamlUrl: GetClashYamlUrl = async () => {
  const url = `${urtConfig.proxies}/clash-yaml-url`;
  const res = await axios.get(url);
  return res.data;
};

export const deleteProxy: DeleteProxy = async (req) => {
  const { id } = req;
  const url = `${urtConfig.proxies}/${id}`;
  await axios.delete(url);
};

export const deleteAllProxies: DeleteAllProxies = async () => {
  const url = `${urtConfig.proxies}`;
  await axios.delete(url);
};

export const getProxyDelay: GetProxyDelay = async (req) => {
  const { id, url: testUrl = "" } = req;
  const url = `${urtConfig.proxies}/delay/${id}`;
  const res = await axios.get(url, { params: { url: testUrl } });
  return res.data;
};

export const testProxyUdp: TestProxyUdp = async (req) => {
  const { id } = req;
  const url = `${urtConfig.proxies}/udp-test/${id}`;
  const res = await axios.get(url);
  return res.data;
};
