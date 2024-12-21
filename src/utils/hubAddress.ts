import { getToken } from "./auth";

const getCoreAddress = () => {
  return window.location.host;
};

export interface HubAddress {
  server: string;
  port: number;
  token: string;
}

const DEFAULT_ADDRESS = "127.0.0.1:9000";

function parseAddress(address: string): HubAddress {
  const [server, port] = address.split(":");
  if (!(server && port)) {
    throw new Error("invalid hub address");
  }
  const token = getToken();
  return { server, port: Number(port), token };
}

export function stringAddress(address: HubAddress): string {
  return `${address.server}:${address.port}`;
}

const HUB_ADDRESS_KEY = "hubAddress";

export function getHubAddress(): HubAddress {
  const isDev = process.env.NODE_ENV === "development";
  const hubAddress = (isDev ? process.env.HUB_ADDRESS : getCoreAddress()) ?? "";

  try {
    return parseAddress(hubAddress);
  } catch {
    return parseAddress(DEFAULT_ADDRESS);
  }
}

export function setHubAddress(address: HubAddress) {
  localStorage.setItem(HUB_ADDRESS_KEY, stringAddress(address));
}
