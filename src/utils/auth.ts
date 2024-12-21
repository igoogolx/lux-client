export const getToken = () => {
  const params = new URL(window.location.href).searchParams;
  return params.get("token") ?? "";
};
