export function formatError (e: any) {
  if (e.response?.data?.message) {
    return e.response?.data?.message as string
  }
  if (e instanceof Error) {
    return e.message
  }
  return JSON.stringify(e)
}
