import {
  type Config,
  makeConfig,
  SHADOWSOCKS_URI,
  SIP002_URI
} from 'shadowsocksconfig'
import { PluginTypeEnum, ProxyTypeEnum, type Shadowsocks } from 'lux-js-sdk'

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

export const parsePluginOptsStr = (optsStr: string) => {
  const opts: Record<string, string> = {}
  optsStr.split(';').forEach((pair) => {
    const values = pair.split('=')
    if (values.length === 2) {
      const [key, value] = values
      if (key === 'obfs') {
        opts.mode = value
      } else if (key === 'obfs-host') {
        opts.host = value
      } else {
        opts[key] = value
      }
    }
  })

  return opts
}

const convertConfig = (rawConfig: Config) => {
  const result: Shadowsocks = {
    type: ProxyTypeEnum.Shadowsocks,
    id: '',
    name: rawConfig.tag.data,
    server: rawConfig.host.data,
    port: rawConfig.port.data,
    cipher: rawConfig.method.data,
    password: rawConfig.password.data,
    udp: true
  }

  const pluginStr = rawConfig.extra.plugin
  if (pluginStr !== '') {
    const separatorIndex = pluginStr.indexOf(';')
    result.plugin = pluginStr.substring(
      0,
      separatorIndex
    ) as Shadowsocks['plugin']
    if ((result.plugin?.includes('obfs')) === true) {
      result.plugin = PluginTypeEnum.Obfs
    }
    result['plugin-opts'] = parsePluginOptsStr(
      pluginStr.substring(separatorIndex + 1)
    ) as Shadowsocks['plugin-opts']
  }
  return result
}

export const decode = (url: string) => {
  const serverUrls = url.split(/[\n\r ]/)
  return serverUrls.map((serverUrl) => {
    const rawConfig = SHADOWSOCKS_URI.parse(serverUrl)
    return convertConfig(rawConfig)
  })
}

export const encode = (config: Shadowsocks) => {
  let pluginStr = `${config.plugin}`
  if (config['plugin-opts'] != null) {
    pluginStr = `${pluginStr};${convertPluginOptsStr(config['plugin-opts'])}`
  }
  return SIP002_URI.stringify(
    makeConfig({
      host: config.server,
      port: config.port,
      method: config.cipher,
      password: config.password,
      tag: config.name,
      plugin: pluginStr
    })
  )
}
