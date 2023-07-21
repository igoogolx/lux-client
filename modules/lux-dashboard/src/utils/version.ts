import pkg from "../../../../package.json";

export const getVersion = () => {
  const params = new URL(window.location.href).searchParams;
  const clientVersion =  (params.get("client_version")||"") as string;
  return  clientVersion || pkg.version;
};
