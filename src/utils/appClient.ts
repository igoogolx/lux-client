export const getIsAppClient = () => {
  const params = new URL(window.location.href).searchParams;
  return !!params.get("is_app_client");
};
