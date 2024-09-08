class UrlConfig {
  private baseUrl = typeof window !== 'undefined' ? window.location.host : ''

  private readonly wsPrefix = 'ws://'

  private readonly httpPrefix = 'http://'

  get base (newUrl: string) {
    return this.baseUrl
  }

  set base (newUrl: string) {
    this.baseUrl = newUrl
  }

  get proxies () {
    return `${this.httpPrefix}${this.baseUrl}/proxies`
  }

  get rule () {
    return `${this.httpPrefix}${this.baseUrl}/rules`
  }

  get selected () {
    return `${this.httpPrefix}${this.baseUrl}/selected`
  }

  get traffic () {
    return `${this.wsPrefix}${this.baseUrl}/traffic`
  }

  get log () {
    return `${this.wsPrefix}${this.baseUrl}/log`
  }

  get ping () {
    return `${this.httpPrefix}${this.baseUrl}/heartbeat/ping`
  }

  get logHttp () {
    return `${this.httpPrefix}${this.baseUrl}/log`
  }

  get wsConnection () {
    return `${this.wsPrefix}${this.baseUrl}/connection`
  }

  get connection () {
    return `${this.httpPrefix}${this.baseUrl}/connection`
  }

  get manager () {
    return `${this.httpPrefix}${this.baseUrl}/manager`
  }

  get setting () {
    return `${this.httpPrefix}${this.baseUrl}/setting`
  }

  get version () {
    return `${this.httpPrefix}${this.baseUrl}/version`
  }

  get isAdmin () {
    return `${this.httpPrefix}${this.baseUrl}/is-admin`
  }

  get runtimeDetail () {
    return `${this.httpPrefix}${this.baseUrl}/runtime-detail`
  }
}

export const urtConfig = new UrlConfig()
