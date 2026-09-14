import { type BaseProxy, getResFromUrl, type Shadowsocks } from "lux-js-sdk";
import { parseUri } from "proxy-uri-parser";
import { makeConfig, SIP002_URI } from "shadowsocksconfig";
import { parse as parseYaml } from "yaml";

export const convertPluginOptsStr = (
  opts: NonNullable<Shadowsocks["plugin-opts"]>,
) => {
  let plugin = "";
  Object.keys(opts).forEach((key) => {
    let nextArg = "";
    const value = opts[key as keyof Shadowsocks["plugin-opts"]];
    if (typeof value === "string") {
      nextArg = `${key}=${value}`;
    } else if (value) {
      nextArg = key;
    }
    if (nextArg) {
      if (plugin) {
        plugin = `${plugin};${nextArg}`;
      } else {
        plugin = nextArg;
      }
    }
  });
  return plugin;
};

export const decodeClashYaml = (text: string) => {
  const rawText = text.trim();
  if (isClashYaml(rawText)) {
    return parseYaml(rawText).proxies as Omit<BaseProxy, "id">[];
  }
  return [] as Omit<BaseProxy, "id">[];
};

export const decodeFromProxyUri = (text: string) => {
  const rawText = text.trim();
  const names: string[] = [];
  let uris: string;
  try {
    uris = atob(rawText);
  } catch {
    uris = rawText;
  }
  return uris
    .trim()
    .split("\n")
    .map((uri) => {
      const proxy = parseUri(uri.trim());
      if (proxy.name === "undefined") {
        const newProxy = { ...proxy };
        proxy.name = "";
        return newProxy;
      }
      if (!names.includes(proxy.name)) {
        names.push(proxy.name);
        return proxy;
      }
      return null;
    })
    .filter(Boolean) as Array<Omit<BaseProxy, "id">>;
};

export const decode = (text: string) => {
  const rawText = text.trim();
  if (rawText.length === 0) {
    return [];
  }

  const proxiesFromClashYaml = decodeClashYaml(rawText);

  if (proxiesFromClashYaml.length !== 0) {
    return proxiesFromClashYaml;
  } else {
    return decodeFromProxyUri(text);
  }
};

export const encode = (config: Shadowsocks) => {
  const inputConfig: Record<string, unknown> = {
    host: config.server,
    port: config.port,
    method: config.cipher,
    password: config.password,
    tag: config.name,
  };
  if (config.plugin) {
    if (config["plugin-opts"] != null) {
      inputConfig.plugin = `${config.plugin};${convertPluginOptsStr(
        config["plugin-opts"],
      )}`;
    }
  }
  return SIP002_URI.stringify(makeConfig(inputConfig));
};

function isClashYaml(text: string) {
  try {
    const clashYaml = parseYaml(text);
    if (Array.isArray(clashYaml?.proxies)) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

export async function decodeFromUrl(url: string) {
  const res = await getResFromUrl({ url });
  if (!res.data) {
    return [];
  }
  return decode(res.data || "");
}
