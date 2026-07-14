export interface WsOptions {
  path?: string;
  headers?: {
    [key: string]: string;
  };
  "max-early-data"?: number;
  "early-data-header-name"?: string;
  "v2ray-http-upgrade"?: boolean;
  "v2ray-http-upgrade-fast-open"?: boolean;
}

export interface HttpOptions {
  method?: string;
  path?: string[];
  headers?: {
    [key: string]: string[];
  };
}

export interface H2Options {
  path?: string;
  host?: string;
}

export interface GrpcOptions {
  "grpc-service-name"?: string;
}

export interface RealityOptions {
  "public-key"?: string;
  "short-id"?: string;
}
export type ClientFingerprint =
  | "chrome"
  | "firefox"
  | "safari"
  | "iOS"
  | "android"
  | "edge"
  | "360"
  | "qq"
  | "random";
export type NetworkType = "ws" | "http" | "h2" | "grpc" | "tcp";
export type CipherType =
  | "none"
  | "auto"
  | "dummy"
  | "aes-128-gcm"
  | "aes-192-gcm"
  | "aes-256-gcm"
  | "lea-128-gcm"
  | "lea-192-gcm"
  | "lea-256-gcm"
  | "aes-128-gcm-siv"
  | "aes-256-gcm-siv"
  | "2022-blake3-aes-128-gcm"
  | "2022-blake3-aes-256-gcm"
  | "aes-128-cfb"
  | "aes-192-cfb"
  | "aes-256-cfb"
  | "aes-128-ctr"
  | "aes-192-ctr"
  | "aes-256-ctr"
  | "chacha20"
  | "chacha20-ietf"
  | "chacha20-ietf-poly1305"
  | "2022-blake3-chacha20-poly1305"
  | "rabbit128-poly1305"
  | "xchacha20-ietf-poly1305"
  | "xchacha20"
  | "aegis-128l"
  | "aegis-256"
  | "aez-384"
  | "deoxys-ii-256-128"
  | "rc4-md5";
// base
interface IProxyBaseConfig {
  tfo?: boolean;
  mptcp?: boolean;
  "interface-name"?: string;
  "routing-mark"?: number;
  "ip-version"?: "dual" | "ipv4" | "ipv6" | "ipv4-prefer" | "ipv6-prefer";
  "dialer-proxy"?: string;
}
// direct
export interface IProxyDirectConfig extends IProxyBaseConfig {
  name: string;
  type: "direct";
}
// dns
export interface IProxyDnsConfig extends IProxyBaseConfig {
  name: string;
  type: "dns";
}
// http
export interface IProxyHttpConfig extends IProxyBaseConfig {
  name: string;
  type: "http";
  server?: string;
  port?: number;
  username?: string;
  password?: string;
  tls?: boolean;
  sni?: string;
  "skip-cert-verify"?: boolean;
  fingerprint?: string;
  headers?: {
    [key: string]: string;
  };
}
// socks5
export interface IProxySocks5Config extends IProxyBaseConfig {
  name: string;
  type: "socks5";
  server?: string;
  port?: number;
  username?: string;
  password?: string;
  tls?: boolean;
  udp?: boolean;
  "skip-cert-verify"?: boolean;
  fingerprint?: string;
}
// ssh
export interface IProxySshConfig extends IProxyBaseConfig {
  name: string;
  type: "ssh";
  server?: string;
  port?: number;
  username?: string;
  password?: string;
  "private-key"?: string;
  "private-key-passphrase"?: string;
  "host-key"?: string;
  "host-key-algorithms"?: string;
}
// trojan
export interface IProxyTrojanConfig extends IProxyBaseConfig {
  name: string;
  type: "trojan";
  server?: string;
  port?: number;
  password?: string;
  alpn?: string[];
  sni?: string;
  "skip-cert-verify"?: boolean;
  fingerprint?: string;
  udp?: boolean;
  network?: NetworkType;
  "reality-opts"?: RealityOptions;
  "grpc-opts"?: GrpcOptions;
  "ws-opts"?: WsOptions;
  "ss-opts"?: {
    enabled?: boolean;
    method?: string;
    password?: string;
  };
  "client-fingerprint"?: ClientFingerprint;
}
// tuic
export interface IProxyTuicConfig extends IProxyBaseConfig {
  name: string;
  type: "tuic";
  server?: string;
  port?: number;
  token?: string;
  uuid?: string;
  password?: string;
  ip?: string;
  "heartbeat-interval"?: number;
  alpn?: string[];
  "reduce-rtt"?: boolean;
  "request-timeout"?: number;
  "udp-relay-mode"?: string;
  "congestion-controller"?: string;
  "disable-sni"?: boolean;
  "max-udp-relay-packet-size"?: number;
  "fast-open"?: boolean;
  "max-open-streams"?: number;
  cwnd?: number;
  "skip-cert-verify"?: boolean;
  fingerprint?: string;
  ca?: string;
  "ca-str"?: string;
  "recv-window-conn"?: number;
  "recv-window"?: number;
  "disable-mtu-discovery"?: boolean;
  "max-datagram-frame-size"?: number;
  sni?: string;
  "udp-over-stream"?: boolean;
  "udp-over-stream-version"?: number;
}
// vless
export interface IProxyVlessConfig extends IProxyBaseConfig {
  name: string;
  type: "vless";
  server?: string;
  port?: number;
  uuid?: string;
  flow?: string;
  tls?: boolean;
  alpn?: string[];
  udp?: boolean;
  "packet-addr"?: boolean;
  xudp?: boolean;
  "packet-encoding"?: string;
  network?: NetworkType;
  "reality-opts"?: RealityOptions;
  "http-opts"?: HttpOptions;
  "h2-opts"?: H2Options;
  "grpc-opts"?: GrpcOptions;
  "ws-opts"?: WsOptions;
  "ws-path"?: string;
  "ws-headers"?: {
    [key: string]: string;
  };
  "skip-cert-verify"?: boolean;
  fingerprint?: string;
  servername?: string;
  "client-fingerprint"?: ClientFingerprint;
}
// vmess
export interface IProxyVmessConfig extends IProxyBaseConfig {
  name: string;
  type: "vmess";
  server?: string;
  port?: number;
  uuid?: string;
  alterId?: number;
  cipher?: CipherType;
  udp?: boolean;
  network?: NetworkType;
  tls?: boolean;
  alpn?: string[];
  "skip-cert-verify"?: boolean;
  fingerprint?: string;
  servername?: string;
  "reality-opts"?: RealityOptions;
  "http-opts"?: HttpOptions;
  "h2-opts"?: H2Options;
  "grpc-opts"?: GrpcOptions;
  "ws-opts"?: WsOptions;
  "packet-addr"?: boolean;
  xudp?: boolean;
  "packet-encoding"?: string;
  "global-padding"?: boolean;
  "authenticated-length"?: boolean;
  "client-fingerprint"?: ClientFingerprint;
}
export interface WireGuardPeerOptions {
  server?: string;
  port?: number;
  "public-key"?: string;
  "pre-shared-key"?: string;
  reserved?: number[];
  "allowed-ips"?: string[];
}
// wireguard
export interface IProxyWireguardConfig extends IProxyBaseConfig, WireGuardPeerOptions {
  name: string;
  type: "wireguard";
  ip?: string;
  ipv6?: string;
  "private-key"?: string;
  workers?: number;
  mtu?: number;
  udp?: boolean;
  "persistent-keepalive"?: number;
  peers?: WireGuardPeerOptions[];
  "remote-dns-resolve"?: boolean;
  dns?: string[];
  "refresh-server-ip-interval"?: number;
}
// hysteria
export interface IProxyHysteriaConfig extends IProxyBaseConfig {
  name: string;
  type: "hysteria";
  server?: string;
  port?: number;
  ports?: string;
  protocol?: string;
  "obfs-protocol"?: string;
  up?: string;
  "up-speed"?: number;
  down?: string;
  "down-speed"?: number;
  auth?: string;
  "auth-str"?: string;
  obfs?: string;
  sni?: string;
  "skip-cert-verify"?: boolean;
  fingerprint?: string;
  alpn?: string[];
  ca?: string;
  "ca-str"?: string;
  "recv-window-conn"?: number;
  "recv-window"?: number;
  "disable-mtu-discovery"?: boolean;
  "fast-open"?: boolean;
  "hop-interval"?: number;
}
// hysteria2
export interface IProxyHysteria2Config extends IProxyBaseConfig {
  name: string;
  type: "hysteria2";
  server?: string;
  port?: number;
  ports?: string;
  "hop-interval"?: number;
  protocol?: string;
  "obfs-protocol"?: string;
  up?: string;
  down?: string;
  password?: string;
  obfs?: string;
  "obfs-password"?: string;
  sni?: string;
  "skip-cert-verify"?: boolean;
  fingerprint?: string;
  alpn?: string[];
  ca?: string;
  "ca-str"?: string;
  cwnd?: number;
  "udp-mtu"?: number;
}
// shadowsocks
export interface IProxyShadowsocksConfig extends IProxyBaseConfig {
  name: string;
  type: "ss";
  server?: string;
  port?: number;
  password?: string;
  cipher?: CipherType;
  udp?: boolean;
  plugin?: "obfs" | "v2ray-plugin" | "shadow-tls" | "restls";
  "plugin-opts"?: {
    mode?: string;
    host?: string;
    password?: string;
    path?: string;
    tls?: string;
    fingerprint?: string;
    headers?: {
      [key: string]: string;
    };
    "skip-cert-verify"?: boolean;
    version?: number;
    mux?: boolean;
    "v2ray-http-upgrade"?: boolean;
    "v2ray-http-upgrade-fast-open"?: boolean;
    "version-hint"?: string;
    "restls-script"?: string;
  };
  "udp-over-tcp"?: boolean;
  "udp-over-tcp-version"?: number;
  "client-fingerprint"?: ClientFingerprint;
}
// shadowsocksR
export interface IProxyshadowsocksRConfig extends IProxyBaseConfig {
  name: string;
  type: "ssr";
  server?: string;
  port?: number;
  password?: string;
  cipher?: CipherType;
  obfs?: string;
  "obfs-param"?: string;
  protocol?: string;
  "protocol-param"?: string;
  udp?: boolean;
}
// sing-mux
export interface IProxySmuxConfig {
  smux?: {
    enabled?: boolean;
    protocol?: "smux" | "yamux" | "h2mux";
    "max-connections"?: number;
    "min-streams"?: number;
    "max-streams"?: number;
    padding?: boolean;
    statistic?: boolean;
    "only-tcp"?: boolean;
    "brutal-opts"?: {
      enabled?: boolean;
      up?: string;
      down?: string;
    };
  };
}
// snell
export interface IProxySnellConfig extends IProxyBaseConfig {
  name: string;
  type: "snell";
  server?: string;
  port?: number;
  psk?: string;
  udp?: boolean;
  version?: number;
  "obfs-opts"?: {};
}

export interface IProxyAnyTLSConfig extends IProxyBaseConfig {
  name: string
  type: 'anytls'
  server?: string
  port?: number
  password?: string
  alpn?: string[]
  sni?: string
  'client-fingerprint'?: ClientFingerprint
  'skip-cert-verify'?: boolean
  fingerprint?: string
  certificate?: string
  'private-key'?: string
  'ech-opts'?: {
    enable?: boolean
    config?: string
  }
  udp?: boolean
  'idle-session-check-interval'?: number
  'idle-session-timeout'?: number
  'min-idle-session'?: number
}

export interface IProxyConfig
  extends IProxyBaseConfig,
    Omit<IProxyDirectConfig, "type">,
      Omit<IProxyDnsConfig, "type">,
      Omit<IProxyHttpConfig, "type">,
      Omit<IProxySocks5Config, "type">,
      Omit<IProxySshConfig, "type">,
      Omit<IProxyTrojanConfig, "type">,
      Omit<IProxyTuicConfig, "type">,
      Omit<IProxyVlessConfig, "type">,
      Omit<IProxyVmessConfig, "type">,
      Omit<IProxyWireguardConfig, "type">,
      Omit<IProxyHysteriaConfig, "type">,
      Omit<IProxyHysteria2Config, "type">,
      Omit<IProxyShadowsocksConfig, "type">,
      Omit<IProxyshadowsocksRConfig, "type">,
      Omit<IProxySmuxConfig, "type">,
      Omit<IProxySnellConfig, "type">,
      Omit<IProxyAnyTLSConfig, "type"> {
  type:
    | "ss"
    | "ssr"
    | "direct"
    | "dns"
    | "snell"
    | "http"
    | "trojan"
    | "hysteria"
    | "hysteria2"
    | "tuic"
    | "wireguard"
    | "ssh"
    | "socks5"
    | "vmess"
    | "vless"
    | "anytls"
  ;
}

