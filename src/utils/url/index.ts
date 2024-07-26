import {
  makeConfig,
  SIP002_URI
} from 'shadowsocksconfig'
import { type BaseProxy, type Shadowsocks } from 'lux-js-sdk'
import { parseUri } from 'proxy-uri-parser/src/index'
import { parse as parseYaml } from 'yaml'
import axios from 'axios'

export const convertPluginOptsStr = (
  opts: NonNullable<Shadowsocks['plugin-opts']>
) => {
  let plugin = ''
  Object.keys(opts).forEach((key) => {
    let nextArg = ''
    const value = opts[key as keyof Shadowsocks['plugin-opts']]
    if (typeof value === 'string') {
      nextArg = `${key}=${value}`
    } else if (value) {
      nextArg = key
    }
    if (nextArg) {
      if (plugin) {
        plugin = `${plugin};${nextArg}`
      } else {
        plugin = nextArg
      }
    }
  })
  return plugin
}

export const decode = (url: string) => {
  const serverUrls = url.split(/[\n\r ]/)
  return serverUrls.map((serverUrl) => {
    return parseUri(serverUrl)
  })
}

export const encode = (config: Shadowsocks) => {
  const inputConfig: Record<string, any> = {
    host: config.server,
    port: config.port,
    method: config.cipher,
    password: config.password,
    tag: config.name
  }
  if (config.plugin) {
    if (config['plugin-opts'] != null) {
      inputConfig.plugin = `${config.plugin};${convertPluginOptsStr(config['plugin-opts'])}`
    }
  }
  return SIP002_URI.stringify(
    makeConfig(inputConfig)
  )
}

function isClashYaml (text: string) {
  try {
    const clashYaml = parseYaml(text)
    if (Array.isArray(clashYaml?.proxies)) {
      return true
    }
  } catch (e) {
    return false
  }
  return false
}

export async function decodeFromUrl (url: string) {
  let proxyConfigs: Array<Omit<BaseProxy, 'id'>> = []
  const res = await axios.get(url)
  if (!res.data) {
    return proxyConfigs
  }
  const rawText = res.data.trim()
  if (isClashYaml(rawText)) {
    proxyConfigs = parseYaml(rawText).proxies
  } else {
    const names: string[] = []
    let uris = ''
    try {
      uris = atob(rawText)
    } catch {
      uris = rawText
    }
    uris
      .trim()
      .split('\n')
      .forEach((uri) => {
        const proxy = parseUri(uri.trim())
        if (!names.includes(proxy.name)) {
          proxyConfigs.push(proxy)
          names.push(proxy.name)
        }
      })
  }
  return proxyConfigs
}
