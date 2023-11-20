export const getVersion = () => {
  const params = new URL(window.location.href).searchParams
  return params.get('client_version') || ''
}
