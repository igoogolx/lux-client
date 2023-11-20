export const MAX_PORT = 65535
export const MIN_PORT = 0

export function isLocalAddr (addr: string) {
  return ['127.0.0.1', 'localhost'].some((item) => addr.includes(item))
}
